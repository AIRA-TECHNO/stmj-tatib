import { Elysia } from "elysia";
import { guardedUserAuthed, LoadUserAuthed } from "@/externals/utils/backend/src/auth-midleware";



const PortofolioNonAcademicController = new Elysia()
  .use(LoadUserAuthed)
  .group('/portofolio-non-academic', (group) => (group.guard({ beforeHandle: guardedUserAuthed }, (app) => {
    app.get('/pdf/download', async () => { 

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