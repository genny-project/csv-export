const csv = (req, res) => {
  console.log('This is a test');
  return res.json({ url: 'URL goes here' });
};


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


export { csv };
