const clc = require("cli-color");

module.exports.reverseString = function (str) {
    return str.slice('').reverse('').join('');
}
module.exports.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

module.exports.success = clc.green;
module.exports.error = clc.red.bold;
module.exports.warn = clc.yellow;
module.exports.notice = clc.blue;
module.exports.pink = clc.magentaBright;

// const { userInfo, arch, cpus, endianness, freemem, getPriority, homedir, hostname, loadavg, machine, networkInterfaces, platform, release, setPriority, tmpdir, totalmem, type, uptime, version } = require("os");
// console.log(userInfo());
// console.log(hostname());
// console.log(arch());
// console.log(cpus());
// console.log(freemem());
// console.log(endianness());
// console.log(getPriority());
// console.log(homedir());
// console.log(networkInterfaces());
// console.log(loadavg());
// console.log(machine());
// console.log(platform())
// console.log(release())
// // console.log(setPriority())
// console.log(tmpdir())
// console.log(totalmem())
// console.log(type())
// console.log(uptime())
// console.log(version())

// let array = [
//   {
//     you: "You",
//     data: {
//       name: "name"
//     }
//   }
// ]

// console.log(array)
// console.log(array[0])
// console.log(array[0]["you"])
// console.log(array[0]["data"].name)

// const IData = [
//   {
//     success: "Success",
//     status: "status",
//     message: "msg",
//     error: "error",
//     data: [{
//       username: "username",
//       email: "email",
//       image: "https://",
//       love: "love"
//     },{
//       username: "username2",
//       email: "email2",
//       image: "https://2"
//     }],
//     image: "img"
//   }
// ]

// console.log(IData);
// console.log(IData[0]);
// console.log(IData[0].data);
// console.log(IData[0].image);
// console.log(IData[0].data[0].image);
// console.log(IData[0].data[1].image);

// IData[0].data.push({
//   username: "username3",
//   email: "email3",
//   image: "https://3"
// })

// IData[0].data.forEach((e) =>{e.image += "new"});

// IData[0].data.map((e) => {
//   console.log(e.image);
// })

// const loveFilter = IData[0].data.filter((e) => e.username === "username2");

// console.log(loveFilter[0]);

// console.log(IData[0].data.filter((e) => e.love));

// const User = [
//   {
//     username: "user1",
//     email: "email1",
//     location: "CA",
//   },
//   {
//     username: "user2",
//     email: "email2",
//     location: "NY",
//   },
//   {
//     username: "user3",
//     email: "email3",
//   },
// ]

// User.map((e) => {
//   console.log(`------`)
//   console.log(e.username);
//   console.log(e.email);
//   console.log(e.location || "");
//   console.log(`------`)
// });