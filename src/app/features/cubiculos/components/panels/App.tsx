import { useRef, useState } from "react";
import {
  InteractiveSvgViewer,
  type InteractiveSvgViewerHandle,
} from "./InteractiveSvgViewer";
import "./App.css";

const SAMPLE_HIGHLIGHTS = ["MZ001", "MZ010", "MZSJ-116"];

function App() {
  const viewerRef = useRef<InteractiveSvgViewerHandle>(null);
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [highlightedIds, setHighlightedIds] =
    useState<string[]>(SAMPLE_HIGHLIGHTS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const previewIds = availableIds.slice(0, 24);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">SVG data-id viewer</p>
          <h1>Interactive SVG inspector</h1>
        </div>
        <div className="toolbar">
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              viewerRef.current?.setHighlightedIds(SAMPLE_HIGHLIGHTS);
            }}
          >
            Restablecer
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              viewerRef.current?.clearAll();
            }}
          >
            Limpiar
          </button>
        </div>
      </header>

      <section className="workspace">
        <section className="viewer-card" aria-label="SVG viewer">
          <div className="card-header">
            <div>
              <p className="card-label">Canvas</p>
              <h2>Plano interactivo</h2>
            </div>
            <span className="count-pill">{availableIds.length} ids</span>
          </div>

          <InteractiveSvgViewer
            ref={viewerRef}
            src="/final2_plain.svg"
            className="viewer-instance"
            defaultHighlightedIds={SAMPLE_HIGHLIGHTS}
            onAvailableIdsChange={setAvailableIds}
            onHighlightedIdsChange={setHighlightedIds}
            onHoveredIdChange={setHoveredId}
            onSelectedIdChange={setSelectedId}
          />
        </section>

        <aside className="inspector-card">
          <div className="card-header">
            <div>
              <p className="card-label">State</p>
              <h2>Inspector</h2>
            </div>
            <button
              type="button"
              className="ghost-button small"
              onClick={() => {
                viewerRef.current?.clearHighlights();
              }}
            >
              Vaciar highlights
            </button>
          </div>

          <dl className="state-grid">
            <div>
              <dt>Hovered</dt>
              <dd>{hoveredId ?? "none"}</dd>
            </div>
            <div>
              <dt>Selected</dt>
              <dd>{selectedId ?? "none"}</dd>
            </div>
            <div>
              <dt>Highlighted</dt>
              <dd>{highlightedIds.length}</dd>
            </div>
            <div>
              <dt>Detected</dt>
              <dd>{availableIds.length}</dd>
            </div>
          </dl>

          <section className="helper-block">
            <h3>IDs de muestra</h3>
            <div className="chip-grid">
              {previewIds.map((id) => {
                const active = highlightedIds.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    className={active ? "chip active" : "chip"}
                    onClick={() => {
                      viewerRef.current?.toggleHighlighted(id);
                    }}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="helper-block">
            <h3>Highlights activos</h3>
            <p className="inline-list">
              {highlightedIds.length > 0 ? highlightedIds.join(", ") : "none"}
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default App;
