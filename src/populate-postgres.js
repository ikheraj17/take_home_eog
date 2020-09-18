/**
 * We have all of our users stored locally in a csv file
 * Now we need to take those users that have been painstakingly gathered
 * and put them into a service where multiple applications can take advantage
 * of them.
 * The filesize could be quite large (in theory) so we will want to utilize
 * streams for processing the data and sending it off to our new postgres database.
 *
 * We will also need a way to know once we have processed all of the data.
 *
 * Each line of data represents one user following the same schema we used
 * earlier when creating our table.
 */

 const fs = require('fs');
 const fastcsv = require('fast-csv');
 const pg = require('pg');
 const config = require('./config');

 const stream = fs.createReadStream('./data-dump/test.csv');
 const csvData = [];
 const client = new pg.Client(config.config);

 let csvStream = fastcsv
 .parse()
 .on("data", data => {
     csvData.push(data);
 })
 .on("end" , () => {
     csvData.shift();
    //  console.log(csvData);
     
    //  client.connect(err => {
    //      if(err) {
    //          return console.error('could not connect to postgres', err);
    //      }
    //      try {
    //         const query = "INSERT INTO people (Title, First, Last, Date, Age, Gender) VALUES ($1, $2, $3, $4, $5, $6)";
    //         csvData.forEach(entry => {
    //             entry[3] = entry[3].slice(0, 10);
    //               client.query(query, entry, (err, res) => {
    //                 if(err) {
    //                     console.log(err.stack);
    //                 }
    //             });
    //         })
    //      }
    //      catch (e) {
    //          console.log('There was an error importing data');
    //      }
    //      finally {
    //        console.log('data import completed');
    //     }
    //  });
    // const asyncForEach = async (array, callback) => {
    //     for (let index = 0; index < array.length; index++) {
    //       await callback(array[index], index, array)
    //     }
    //   };

    // const seed = async () => {
    //     await asyncForEach(csvData, async (entry) => {
    //         const query = "INSERT INTO people (Title, First, Last, Date, Age, Gender) VALUES ($1, $2, $3, $4, $5, $6)";
    //         entry[3] = entry[3].slice(0,10);
    //         client.query(query, entry)
    //         .then((res) => {
    //             if(entry === csvData[csvData.length -1]) {
    //                 console.log('final row inserted');
    //             } else {
    //                 console.log('row inserted');
    //             }
                
    //         })
    //         .catch(err => {
    //             console.log('error inseting rows: ', err);
    //         })  
    //     })
    // }

    client.connect()
    .then(() => {
        const query = "INSERT INTO people (Title, First, Last, Date, Age, Gender) VALUES ($1, $2, $3, $4, $5, $6)";
         csvData.forEach(entry => {
            entry[3] = entry[3].slice(0, 10);
            return client.query(query, entry)
            .then(res => {
                if(csvData[csvData.length -1] === entry) {
                    console.log('final row inserted');
                    client.end();
                } else {
                    console.log(`row ${csvData.indexOf(entry)} inserted`);
                }
            })
            .catch(err => {
                console.error('There was an error inserting data: ', err);
            })
        })  
        // seed();
    })
    .catch(error => {
        console.error('error connecting to db: ', error);
    })
 });

 stream.pipe(csvStream);

 