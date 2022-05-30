import React, { useEffect } from "react";
import "./styles.css";

const PDFJS = window.pdfjsLib;

export default function App() {
  const [pdf, setPdf] = React.useState("");
  const [width, setWidth] = React.useState(0);
  const [image, setImage] = React.useState("");
  const [height, setHeight] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pdfRendering, setPdfRendering] = React.useState("");
  const [pageRendering, setPageRendering] = React.useState("");

  async function showPdf(event) {
    try {
      setPdfRendering(true);
      const file = event.target.files[0];
      const uri = URL.createObjectURL(file);
      var _PDF_DOC = await PDFJS.getDocument({ url: uri });
      setPdf(_PDF_DOC);
      setPdfRendering(false);
      document.getElementById("file-to-upload").value = "";
    } catch (error) {
      alert(error.message);
    }
  }

  function changePage() {
    setCurrentPage();
  }

  async function renderPage() {
    setPageRendering(true);

    var page = await pdf.getPage(currentPage);

    var viewport = page.getViewport(currentPage);

    var render_context = {
      canvasContext: document.querySelector("#pdf-canvas").getContext("2d"),
      viewport: viewport
    };
    console.log("viewport", viewport);
    setWidth(viewport.width);
    setHeight(viewport.height);
    await page.render(render_context);

    var canvas = document.getElementById("pdf-canvas");
    var img = canvas.toDataURL("image/png");
    setImage(img);
    setPageRendering(false);
  }

  useEffect(() => {
    pdf && renderPage();
    // eslint-disable-next-line
  }, [pdf, currentPage]);

  return (
    <div className="App">
      <button
        id="upload-button"
        onClick={() => document.getElementById("file-to-upload").click()}
      >
        Select PDF
      </button>
      <input
        type="file"
        id="file-to-upload"
        accept="application/pdf"
        hidden
        onChange={showPdf}
      />
      <div id="pdf-main-container">
        <div id="pdf-loader" hidden={!pdfRendering}>
          Loading document ...
        </div>
        <div id="page-count-container">
          Page {currentPage} of <div id="pdf-total-pages">{totalPages}</div>
        </div>
        <div id="pdf-contents">
          <div id="pdf-meta">
            <div id="pdf-buttons">
              <button id="pdf-prev" onClick={() => changePage(currentPage - 1)}>
                Previous
              </button>
              <button id="pdf-next" onClick={() => changePage(currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
          <div id="image-convas-row">
            <canvas id="pdf-canvas" width={width} height={height}></canvas>
            {image && (
              <img
                id="image-generated"
                src={image}
                alt="pdfImage"
                style={{ width: width, height: height }}
              />
            )}
          </div>
          <div id="page-loader" hidden={!pageRendering}>
            Loading page ...
          </div>
          <button>Show PNG</button>
          <button>Download PNG</button>
        </div>
      </div>
    </div>
  );
}
