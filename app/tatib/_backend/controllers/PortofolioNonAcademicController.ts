import { Elysia } from "elysia";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";
import puppeteer from 'puppeteer-core'
import { Launcher } from "chrome-launcher"


const PortofolioNonAcademicController = new Elysia()
  .use(LoadUserAuthed)
  .group('/portofolio-non-academic', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/pdf/test', async ({ }) => {
      return { message: 'oke' }
    })
    app.get('/pdf/download', async ({ set }) => {
      const browser = await puppeteer.launch({
        executablePath: Launcher.getInstallations()[0],
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });


      const page = await browser.newPage();

      await page.setContent(`
        <html>
          <body>
            <h1>Hello from Elysia & Puppeteer!</h1>
            <p>This is a sample PDF document generated from HTML.</p>
          </body>
        </html>
      `);

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();


      set.headers['content-type'] = 'application/pdf';
      set.headers['content-disposition'] = 'inline; filename="generated.pdf"';

      return pdfBuffer;
    });
    // app.get('/pdf/download', async () => {
    //   const userProfile = {
    //     name: 'John Doe',
    //     email: 'johndoe@example.com',
    //     address: '123 Main Street, Springfield, IL',
    //   };

    //   // Create a new PDF document
    //   const pdfDoc = await PDFDocument.create();

    //   // Add a page to the document
    //   const page = pdfDoc.addPage([600, 400]);

    //   // Set font and size for text
    //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    //   // Draw text on the page (name, email, and address)
    //   page.drawText(`Name: ${userProfile.name}`, {
    //     x: 50,
    //     y: 350,
    //     font: font,
    //     size: 18,
    //   });

    //   page.drawText(`Email: ${userProfile.email}`, {
    //     x: 50,
    //     y: 320,
    //     font: font,
    //     size: 18,
    //   });

    //   page.drawText(`Address: ${userProfile.address}`, {
    //     x: 50,
    //     y: 290,
    //     font: font,
    //     size: 18,
    //   });

    //   // Serialize the document to bytes
    //   return await pdfDoc.save();
    // })

    return app
  })));



export default PortofolioNonAcademicController