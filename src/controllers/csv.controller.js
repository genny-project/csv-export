import * as CSV from 'csv-string';
import fs from 'fs';
import path from 'path';
const createCsvWriter = require('csv-writer').createArrayCsvWriter;


const csv = (req, res) => {
  const csvString = req.body || null;
  const strrr  = '"CompanyName", "ReleaseNumber", "ReleaseDate", "RailYard", "ShippingCompany", "NumberOfContainer", "ContainerSize", "DeliveryDate", "AllocatedDriver", "ContactNumber", "ContainerId", "ContainerNumber",\n"Name","Number","2018-11-24","Yard","Line","1","45DR","2018-11-07T05:15:31","PER_SAFAL0079_AT_GMAILCOM","Number","1212","45DR",\n';
  const arr = CSV.parse(strrr);

  const csvWriter = createCsvWriter({
    header: arr[0],
    path: path.join(__dirname, '../../public/uploads/file.csv'),
  });



};


export { csv };



// function exportCSVFiles(req, res) {
//   Job.find()
//     .populate('company')
//     .populate('jobs')
//     .exec((err, company) => {
//       if (err) return res.send(err);
//       fs.writeFile(path.join(__dirname, '../public/file.csv'), company, (err) => {
//         if (err) throw err;
//         console.log('Docker test');
//         return res.sendFile(path.join(__dirname, '../public/file.csv'));
//       });
//     });
// }