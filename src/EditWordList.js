import fs from 'fs';
import csv from 'csv-parser';


  
async function readCSVFile(filePath) {
    const results = []
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {console.log(data)})
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
    
}  
readCSVFile('src/assets/anki_sample_word_upfront.txt')