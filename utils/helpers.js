// Generate invoice number dengan format: INV{tanggal}-{nomor}
const generateInvoiceNumber = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000000);
  
  return `INV${day}${month}${year}-${String(random).padStart(6, '0')}`;
};

module.exports = {
  generateInvoiceNumber
};
