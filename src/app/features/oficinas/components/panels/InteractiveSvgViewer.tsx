import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { useSvgInteractionState } from "../../hooks/useSvgInteractionState";

type BaseProps = {
  className?: string;
  style?: CSSProperties;
  dataAttribute?: `data-${string}`;

  highlightedIds?: string[];
  disabledIds?: string[];
  reservedIds?: string[];
  hoveredId?: string | null;
  selectedId?: string | null;

  defaultHighlightedIds?: string[];
  defaultSelectedId?: string | null;

  onAvailableIdsChange?: (ids: string[]) => void;
  onHighlightedIdsChange?: (ids: string[]) => void;
  onHoveredIdChange?: (id: string | null) => void;
  onSelectedIdChange?: (id: string | null) => void;
  onSelectId?: (id: string) => void;
};

type SvgElementProps = {
  svg: ReactElement;
  src?: never;
};

type SvgSourceProps = {
  src: string;
  svg?: never;
};

export type InteractiveSvgViewerProps = BaseProps &
  (SvgElementProps | SvgSourceProps);

export type InteractiveSvgViewerHandle = {
  setHighlightedIds: (ids: string[]) => void;
  toggleHighlighted: (id: string) => void;
  clearHighlights: () => void;
  clearSelection: () => void;
  clearAll: () => void;
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
const OVERLAY_ATTR = "data-interactive-overlay-root";
const FILTER_ATTR = "data-interactive-filter-root";

type HighlightKind = "reserved" | "highlighted";

const HIGHLIGHT_PRIORITY: HighlightKind[] = ["reserved", "highlighted"];

function joinClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function uniqueIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}

function escapeCssSelectorValue(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return value.replace(/["\\]/g, "\\$&");
}

function stripOverlayMetadata(element: Element, dataAttribute: string) {
  element.removeAttribute("id");
  element.removeAttribute(dataAttribute);
  element.removeAttribute("transform");
  element.removeAttribute("data-runtime-hover");
  element.setAttribute("data-overlay-clone", "true");
  element.setAttribute("aria-hidden", "true");

  Array.from(element.querySelectorAll("*")).forEach((node) => {
    node.removeAttribute("id");
    node.removeAttribute(dataAttribute);
    node.removeAttribute("data-runtime-hover");
    node.setAttribute("aria-hidden", "true");
  });
}

function ensureRootDefs(svgRoot: SVGSVGElement) {
  const existingDefs = Array.from(svgRoot.children).find(
    (node): node is SVGDefsElement => node.tagName.toLowerCase() === "defs",
  );

  if (existingDefs) {
    return existingDefs;
  }

  const defs = document.createElementNS(SVG_NAMESPACE, "defs");
  svgRoot.insertBefore(defs, svgRoot.firstChild);
  return defs;
}

function ensureOverlayFilters(svgRoot: SVGSVGElement, filterPrefix: string) {
  const defs = ensureRootDefs(svgRoot);
  let filterGroup = defs.querySelector<SVGGElement>(`g[${FILTER_ATTR}]`);

  if (!filterGroup) {
    filterGroup = document.createElementNS(SVG_NAMESPACE, "g");
    filterGroup.setAttribute(FILTER_ATTR, "true");
    defs.appendChild(filterGroup);
  }

  const filterSpecs: Record<
    HighlightKind,
    { color: string; opacity: string; radius: string; blur: string }
  > = {
    reserved: {
      color: "#94a3b8",
      opacity: "0.55",
      radius: "0.8",
      blur: "1.2",
    },
    highlighted: {
      color: "#3b82f6",
      opacity: "0.55",
      radius: "0.8",
      blur: "1.4",
    },
  };

  HIGHLIGHT_PRIORITY.forEach((kind) => {
    const id = `${filterPrefix}-${kind}`;

    if (filterGroup?.querySelector(`#${id}`)) {
      return;
    }

    const filter = document.createElementNS(SVG_NAMESPACE, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("x", "-12%");
    filter.setAttribute("y", "-12%");
    filter.setAttribute("width", "124%");
    filter.setAttribute("height", "124%");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const morphology = document.createElementNS(SVG_NAMESPACE, "feMorphology");
    morphology.setAttribute("in", "SourceAlpha");
    morphology.setAttribute("operator", "dilate");
    morphology.setAttribute("radius", filterSpecs[kind].radius);
    morphology.setAttribute("result", "expanded");

    const flood = document.createElementNS(SVG_NAMESPACE, "feFlood");
    flood.setAttribute("flood-color", filterSpecs[kind].color);
    flood.setAttribute("flood-opacity", filterSpecs[kind].opacity);
    flood.setAttribute("result", "tint");

    const composite = document.createElementNS(SVG_NAMESPACE, "feComposite");
    composite.setAttribute("in", "tint");
    composite.setAttribute("in2", "expanded");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "solidGlow");

    const blur = document.createElementNS(SVG_NAMESPACE, "feGaussianBlur");
    blur.setAttribute("in", "solidGlow");
    blur.setAttribute("stdDeviation", filterSpecs[kind].blur);
    blur.setAttribute("result", "softGlow");

    const merge = document.createElementNS(SVG_NAMESPACE, "feMerge");

    const firstNode = document.createElementNS(SVG_NAMESPACE, "feMergeNode");
    firstNode.setAttribute("in", "softGlow");

    const secondNode = document.createElementNS(SVG_NAMESPACE, "feMergeNode");
    secondNode.setAttribute("in", "solidGlow");

    merge.appendChild(firstNode);
    merge.appendChild(secondNode);

    filter.appendChild(morphology);
    filter.appendChild(flood);
    filter.appendChild(composite);
    filter.appendChild(blur);
    filter.appendChild(merge);

    filterGroup?.appendChild(filter);
  });
}

function ensureOverlayLayer(svgRoot: SVGSVGElement) {
  let overlayLayer = svgRoot.querySelector<SVGGElement>(`g[${OVERLAY_ATTR}]`);

  if (!overlayLayer) {
    overlayLayer = document.createElementNS(SVG_NAMESPACE, "g");
    overlayLayer.setAttribute(OVERLAY_ATTR, "true");
    overlayLayer.setAttribute("pointer-events", "none");
    svgRoot.appendChild(overlayLayer);
  }

  return overlayLayer;
}

function readDataId(element: Element, dataAttribute: string) {
  return element.getAttribute(dataAttribute);
}

function toSvgMatrix(matrix: DOMMatrix) {
  return `matrix(${[matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]
    .map((value) => Number(value.toFixed(6)))
    .join(" ")})`;
}
function buildHighlightMap({
  reservedIds,
  highlightedIds,
}: {
  reservedIds: string[];
  highlightedIds: string[];
}) {
  const map = new Map<string, HighlightKind>();

  reservedIds.forEach((id) => {
    map.set(id, "reserved");
  });

  highlightedIds.forEach((id) => {
    map.set(id, "highlighted");
  });

  return map;
}
function clearRuntimeSelected(svgRoot: SVGSVGElement) {
  svgRoot.querySelectorAll('[data-runtime-selected="true"]').forEach((node) => {
    node.removeAttribute("data-runtime-selected");
  });
}

function applyRuntimeSelected(
  svgRoot: SVGSVGElement,
  dataAttribute: string,
  id: string | null,
) {
  clearRuntimeSelected(svgRoot);

  if (!id) {
    return;
  }

  const escapedId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replace(/["\\]/g, "\\$&");

  const node = svgRoot.querySelector(`[${dataAttribute}="${escapedId}"]`);

  if (node) {
    node.setAttribute("data-runtime-selected", "true");
  }
}
function clearRuntimeHover(svgRoot: SVGSVGElement) {
  svgRoot.querySelectorAll('[data-runtime-hover="true"]').forEach((node) => {
    node.removeAttribute("data-runtime-hover");
  });
}

function applyRuntimeHover(
  svgRoot: SVGSVGElement,
  dataAttribute: string,
  id: string | null,
) {
  clearRuntimeHover(svgRoot);

  if (!id) {
    return;
  }

  const escapedId = escapeCssSelectorValue(id);
  const node = svgRoot.querySelector(`[${dataAttribute}="${escapedId}"]`);

  if (node) {
    node.setAttribute("data-runtime-hover", "true");
  }
}

const InteractiveSvgViewer = forwardRef<
  InteractiveSvgViewerHandle,
  InteractiveSvgViewerProps
>(function InteractiveSvgViewer(
  {
    className,
    style,
    dataAttribute = "data-id",

    highlightedIds: controlledHighlightedIds,
    disabledIds = [],
    reservedIds = [],
    hoveredId: controlledHoveredId,
    selectedId: controlledSelectedId,

    defaultHighlightedIds,
    defaultSelectedId,

    onAvailableIdsChange,
    onHighlightedIdsChange,
    onHoveredIdChange,
    onSelectedIdChange,
    onSelectId,

    ...sourceProps
  },
  ref,
) {
  const availableIdsRef = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const filterIdPrefix = useId().replace(/:/g, "");
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [markupHost, setMarkupHost] = useState<HTMLDivElement | null>(null);
  const [renderedMarkupVersion, setRenderedMarkupVersion] = useState(0);

  const srcValue = "src" in sourceProps ? sourceProps.src : null;
  const svgElement = "svg" in sourceProps ? sourceProps.svg : null;

  const internalState = useSvgInteractionState({
    defaultHighlightedIds,
    defaultSelectedId,
  });

  const highlightedIds =
    controlledHighlightedIds ?? internalState.highlightedIds;

  const hoveredId = controlledHoveredId ?? internalState.hoveredId;

  const selectedId = controlledSelectedId ?? internalState.selectedId;

  const setHoveredId = useCallback(
    (id: string | null) => {
      if (controlledHoveredId === undefined) {
        internalState.setHoveredId(id);
        return;
      }

      onHoveredIdChange?.(id);
    },
    [controlledHoveredId, internalState, onHoveredIdChange],
  );

  const setSelectedId = useCallback(
    (id: string | null) => {
      if (controlledSelectedId === undefined) {
        internalState.setSelectedId(id);
        return;
      }

      onSelectedIdChange?.(id);
    },
    [controlledSelectedId, internalState, onSelectedIdChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      setHighlightedIds: internalState.setHighlightedIds,
      toggleHighlighted: internalState.toggleHighlighted,
      clearHighlights: internalState.clearHighlights,
      clearSelection: internalState.clearSelection,
      clearAll: internalState.clearAll,
    }),
    [internalState],
  );

  const handleMarkupHost = useCallback((node: HTMLDivElement | null) => {
    setMarkupHost(node);
  }, []);
  useEffect(() => {
    const svgRoot =
      (markupHost ?? containerRef.current)?.querySelector("svg") ?? null;

    if (!svgRoot) {
      return;
    }

    applyRuntimeSelected(svgRoot, dataAttribute, selectedId);
  }, [
    dataAttribute,
    selectedId,
    markupHost,
    renderedMarkupVersion,
    srcValue,
    svgElement,
    svgMarkup,
  ]);
  useEffect(() => {
    if (controlledHighlightedIds !== undefined) {
      return;
    }

    onHighlightedIdsChange?.(highlightedIds);
  }, [controlledHighlightedIds, highlightedIds, onHighlightedIdsChange]);

  useEffect(() => {
    if (controlledHoveredId !== undefined) {
      return;
    }

    onHoveredIdChange?.(hoveredId);
  }, [controlledHoveredId, hoveredId, onHoveredIdChange]);

  useEffect(() => {
    if (controlledSelectedId !== undefined) {
      return;
    }

    onSelectedIdChange?.(selectedId);
  }, [controlledSelectedId, selectedId, onSelectedIdChange]);

  useEffect(() => {
    if (!markupHost || !srcValue) {
      return;
    }

    markupHost.innerHTML = svgMarkup ?? "";
    setRenderedMarkupVersion((version) => version + 1);
  }, [markupHost, srcValue, svgMarkup]);

  useEffect(() => {
    const svgRoot =
      (markupHost ?? containerRef.current)?.querySelector("svg") ?? null;

    const commitAvailableIds = (ids: string[]) => {
      const next = uniqueIds(ids).sort();
      const current = availableIdsRef.current;

      const hasSameIds =
        current.length === next.length &&
        current.every((entry, index) => entry === next[index]);

      if (hasSameIds) {
        return;
      }

      availableIdsRef.current = next;
      setAvailableIds(next);
    };

    if (!svgRoot) {
      commitAvailableIds([]);
      return;
    }

    ensureOverlayFilters(svgRoot, filterIdPrefix);
    const overlayLayer = ensureOverlayLayer(svgRoot);
    overlayLayer.replaceChildren();

    const sourceNodes = Array.from(
      svgRoot.querySelectorAll(`[${dataAttribute}]`),
    ).filter((node): node is SVGGraphicsElement => {
      return (
        node instanceof SVGGraphicsElement &&
        !node.closest(`g[${OVERLAY_ATTR}]`)
      );
    });

    sourceNodes.forEach((node) => {
      const id = readDataId(node, dataAttribute);
      const fill = node.getAttribute("fill");

      if (!fill || fill === "none") {
        node.setAttribute("fill", "transparent");
      }

      node.setAttribute("pointer-events", "fill");

      if (id && disabledIds.includes(id)) {
        node.setAttribute("cursor", "not-allowed");
      } else {
        node.setAttribute("cursor", "pointer");
      }
    });

    commitAvailableIds(
      sourceNodes
        .map((node) => readDataId(node, dataAttribute))
        .filter((id): id is string => Boolean(id)),
    );

    const highlightMap = buildHighlightMap({
      reservedIds,
      highlightedIds,
    });

    HIGHLIGHT_PRIORITY.forEach((kind) => {
      sourceNodes.forEach((node) => {
        const id = readDataId(node, dataAttribute);

        if (!id || highlightMap.get(id) !== kind) {
          return;
        }

        const clone = node.cloneNode(true);

        if (!(clone instanceof Element)) {
          return;
        }

        const nodeMatrix = node.getCTM();
        const overlayMatrix = overlayLayer.getCTM();

        if (!nodeMatrix || !overlayMatrix) {
          return;
        }

        const wrapper = document.createElementNS(SVG_NAMESPACE, "g");
        const relativeMatrix = overlayMatrix.inverse().multiply(nodeMatrix);

        wrapper.setAttribute("transform", toSvgMatrix(relativeMatrix));
        wrapper.setAttribute("filter", `url(#${filterIdPrefix}-${kind})`);
        wrapper.setAttribute("pointer-events", "none");
        wrapper.setAttribute("aria-hidden", "true");

        stripOverlayMetadata(clone, dataAttribute);
        clone.setAttribute("pointer-events", "none");

        const xlinkHref = node.getAttributeNS(XLINK_NAMESPACE, "href");

        if (xlinkHref) {
          clone.setAttributeNS(XLINK_NAMESPACE, "xlink:href", xlinkHref);
        }

        wrapper.appendChild(clone);
        overlayLayer.appendChild(wrapper);
      });
    });
  }, [
    dataAttribute,
    filterIdPrefix,
    highlightedIds,
    selectedId,
    disabledIds,
    reservedIds,
    markupHost,
    renderedMarkupVersion,
    srcValue,
    svgElement,
    svgMarkup,
  ]);

  useEffect(() => {
    const svgRoot =
      (markupHost ?? containerRef.current)?.querySelector("svg") ?? null;

    if (!svgRoot) {
      return;
    }

    applyRuntimeHover(svgRoot, dataAttribute, hoveredId);
  }, [
    dataAttribute,
    hoveredId,
    markupHost,
    renderedMarkupVersion,
    srcValue,
    svgElement,
    svgMarkup,
  ]);

  useEffect(() => {
    onAvailableIdsChange?.(availableIds);
  }, [availableIds, onAvailableIdsChange]);

  useEffect(() => {
    if (!srcValue) {
      return;
    }

    let cancelled = false;

    setLoadError(null);
    setSvgMarkup(null);

    fetch(srcValue)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar el SVG (${response.status})`);
        }

        return response.text();
      })
      .then((markup) => {
        if (cancelled) {
          return;
        }

        setSvgMarkup(markup);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setLoadError(
          error instanceof Error ? error.message : "No se pudo cargar el SVG.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [srcValue]);

  useEffect(() => {
    const svgRoot =
      (markupHost ?? containerRef.current)?.querySelector("svg") ?? null;

    if (!svgRoot) {
      return;
    }

    const selector = `[${dataAttribute}]`;

    const handlePointerOver = (event: PointerEvent) => {
      const eventTarget = event.target;

      if (!(eventTarget instanceof Element)) {
        return;
      }

      const match = eventTarget.closest(selector);

      if (!match || match.closest(`g[${OVERLAY_ATTR}]`)) {
        return;
      }

      const id = readDataId(match, dataAttribute);

      if (!id || disabledIds.includes(id)) {
        return;
      }

      setHoveredId(id);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const eventTarget = event.target;
      const relatedTarget = event.relatedTarget;

      if (!(eventTarget instanceof Element)) {
        return;
      }

      const match = eventTarget.closest(selector);

      if (!match) {
        return;
      }

      if (relatedTarget instanceof Element) {
        const nextMatch = relatedTarget.closest(selector);

        if (nextMatch === match) {
          return;
        }
      }

      setHoveredId(null);
    };

    const handlePointerLeave = () => {
      setHoveredId(null);
    };

    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;

      if (!(eventTarget instanceof Element)) {
        return;
      }

      const match = eventTarget.closest(selector);

      if (!match || match.closest(`g[${OVERLAY_ATTR}]`)) {
        return;
      }

      const nextId = readDataId(match, dataAttribute);

      if (!nextId || disabledIds.includes(nextId)) {
        return;
      }

      onSelectId?.(nextId);
      setSelectedId(nextId === selectedId ? null : nextId);
    };

    svgRoot.addEventListener("pointerover", handlePointerOver);
    svgRoot.addEventListener("pointerout", handlePointerOut);
    svgRoot.addEventListener("pointerleave", handlePointerLeave);
    svgRoot.addEventListener("click", handleClick);

    return () => {
      svgRoot.removeEventListener("pointerover", handlePointerOver);
      svgRoot.removeEventListener("pointerout", handlePointerOut);
      svgRoot.removeEventListener("pointerleave", handlePointerLeave);
      svgRoot.removeEventListener("click", handleClick);
    };
  }, [
    dataAttribute,
    markupHost,
    selectedId,
    disabledIds,
    srcValue,
    svgElement,
    svgMarkup,
    setHoveredId,
    setSelectedId,
    onSelectId,
  ]);

  let svgContent: ReactElement | null = null;

  if (svgElement) {
    svgContent = cloneElement(svgElement);
  }

  return (
    <div
      className={joinClassNames(
        "relative min-h-full overflow-hidden rounded-md",
        className,
      )}
      style={style}
    >
      {srcValue ? (
        <div
          ref={containerRef}
          className={[
            "min-h-[inherit] w-full p-2",
            "[&>div]:min-h-[inherit]",
            "[&_svg]:block",
            "[&_svg]:h-auto",
            "[&_svg]:w-full",
            "[&_svg]:overflow-visible",
            "[&_svg_[data-id]]:cursor-pointer",
          ].join(" ")}
        >
          {loadError ? (
            <div className="grid min-h-[inherit] place-items-center p-6 text-center text-[#9b2f2f]">
              {loadError}
            </div>
          ) : svgMarkup ? (
            <div ref={handleMarkupHost} />
          ) : (
            <div className="grid min-h-[inherit] place-items-center p-6 text-center text-[#49606f]">
              Cargando SVG...
            </div>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          className={[
            "min-h-[inherit] w-full p-2",
            "[&>div]:min-h-[inherit]",
            "[&_svg]:block",
            "[&_svg]:h-auto",
            "[&_svg]:w-full",
            "[&_svg]:overflow-visible",
            "[&_svg_[data-id]]:cursor-pointer",
          ].join(" ")}
        >
          {svgContent}
        </div>
      )}
    </div>
  );
});

export default InteractiveSvgViewer;
