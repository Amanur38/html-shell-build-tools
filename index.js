var sass = require("sass");
var fs = require("fs");
const chokidar = require("chokidar");

const dirName = "./sass/";
const outputDir = "./src/css/style.css";
const sassOutputMainFile = "artifact.scss";

chokidar.watch(dirName).on("all", (event, path) => {
    generateSassToCss();
});

function generateSassToCss() {
  fs.readdir(dirName, async (error, filenames) => {
    var outSteam = fs.createWriteStream(dirName + sassOutputMainFile, {
      autoClose: false,
    });

    if (error) {
      onerror(error);
      return;
    }

    var count = 0;
    filenames.map(async (file, index) => {
      if (file !== sassOutputMainFile) {
        fs.readFile(dirName + file, (error, data) => {
          fs.writeFile(dirName + sassOutputMainFile, data.toString(), (err) => {
            if (err) console.log(err);
                // TODO for write scss file
          });
        });
      }
      count++;
    });

    if (count === filenames.length) {
      setTimeout(() => {
        outSteam.end();
        sass.render(
          {
            file: dirName + sassOutputMainFile,
            outputStyle: "compressed",
            outFile: outputDir,
          },
          (err, result) => {
            if (!err) {
              fs.writeFile(
                outputDir,
                result.css.toString(),
                (err) => {
                  if (!err) {
                    console.log("Successfully css build success to File.");
                  }
                }
              );
            }
          }
        );
      }, 100);
    }
  });
}
