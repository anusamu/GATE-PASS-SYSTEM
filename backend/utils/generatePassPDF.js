const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = (pass) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, "../uploads/passes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `gatepass-${pass._id}.pdf`);
    const doc = new PDFDocument({ margin: 40 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("GATE PASS", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Pass ID: ${pass._id}`);
    doc.text(`Status: ${pass.status}`);
    doc.text(`Issued On: ${new Date(pass.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.text(`Requester: ${pass.requesterName}`);
    doc.text(`Department: ${pass.department}`);
    doc.moveDown();

    doc.text(`Asset: ${pass.assetName}`);
    doc.text(`Serial No: ${pass.assetSerialNo}`);
    doc.text(`Purpose: ${pass.purpose}`);
    doc.moveDown();

    doc.text(`External Person: ${pass.externalPersonName}`);
    doc.text(`Email: ${pass.externalPersonEmail}`);
    doc.text(`Phone: ${pass.externalPersonPhone || "-"}`);

    if (pass.passType === "RETURNABLE") {
      doc.moveDown();
      doc.text(`Return Date: ${new Date(pass.returnDateTime).toLocaleString()}`);
    }

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
