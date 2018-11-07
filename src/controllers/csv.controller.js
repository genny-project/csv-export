import * as CSV from 'csv-string';
import path from 'path';

const createCsvWriter = require('csv-writer').createArrayCsvWriter;


const csv = (req, res) => {
  // Default the request to be null to prevent inconsistencies
  const csvString = req.body || null;
  if (csvString) {
    // const strrr = '"CompanyName", "ReleaseNumber", "ReleaseDate", "RailYard", "ShippingCompany", "NumberOfContainer", "ContainerSize", "DeliveryDate", "AllocatedDriver", "ContactNumber", "ContainerId", "ContainerNumber",\n"Name","Number","2018-11-24","Yard","Line","1","45DR","2018-11-07T05:15:31","PER_SAFAL0079_AT_GMAILCOM","Number","1212","45DR",\n';
    const check = csvString;
    try {
      const arr = CSV.parse(check);
      const filename = Date.now();
      const csvWriter = createCsvWriter({
        header: arr[0],
        path: path.join(__dirname, `../../public/uploads/${filename}.csv`),
      });

      const records = arr;

      csvWriter.writeRecords(records) // returns a promise
        .then(() => {
          console.log('...Done');
          return res.status(200).json({ message: 'Done' });
        });
    } catch (err) {
      res.status(500);
      console.log(' Error While writing csv');
      return res.json({ message: 'Error writing file ' });
    }
  } else {
    return res.status(500).json({ message: "String not found or doesn't exists" });
  }
};


export { csv };
