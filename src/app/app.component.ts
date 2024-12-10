import {AfterViewInit, Component, Inject} from '@angular/core';
import {getDocument, GlobalWorkerOptions, PDFDocumentProxy} from 'pdfjs-dist';
import {RenderParameters} from 'pdfjs-dist/types/src/display/api';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {

  file?: File;
  pdfPreviewImgData?: string

  constructor(@Inject(DOCUMENT) private document: Document) {
    GlobalWorkerOptions.workerSrc = `/assets/pdf.worker.min.mjs`;
  }

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.file = files[0];
    this.renderPreview(this.file);
  }

  async renderPreview(file: File) {
    // create a canvas to render the pdf into
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

    const data =  await file.arrayBuffer();
    const pdf: PDFDocumentProxy = await getDocument(data).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({scale: 1});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext: RenderParameters = {
      canvasContext: canvasContext,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    this.pdfPreviewImgData = canvas.toDataURL();
    await pdf.destroy();
  }

}
