// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { electron } = require('process')
const url = require('url')
//const {dialog} = require('electron').remote;
const { dialog } = require('electron')

// set env
//process.env.NODE_ENV = 'production'

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // global varibale with no pre fix
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // <- fix the error: require is not defined
      contextIsolation: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Quit app when closed
  mainWindow.on('closed', function () {
    app.quit()
  })

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // insert menu
  Menu.setApplicationMenu(mainMenu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// save as: app.on('ready', function () {})
app.on('ready', function () {
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// handel create add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Item',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // <- fix the error: require is not defined
      contextIsolation: false,
    },
  })
  // and load the index.html of the app.
  addWindow.loadFile(path.join(__dirname, 'addWindow.html'))

  // Garbage collection
  addWindow.on('close', function () {
    addWindow = null
  })
}

// ------------------------------- Catch item:add ---------------------
ipcMain.on('item:add', function (e, item) {
  // catch from html with ipcMain at main.js
  console.log(item)
  mainWindow.webContents.send('item:add', item) // send from js to html
  addWindow.close()
})

// ---------------------------------- open file -------------------------
ipcMain.on('open-file',(event,data)=>{

  console.log("open file")
  var tempPath = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
  console.log(tempPath);
  /*dialog.showOpenDialog(null, data).then(filePaths => {
      event.sender.send('open-file-paths', filePaths);
  });*/
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Create menu template

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Developing Tool',
        click(item, mainWindow) {
          mainWindow.toggleDevTools()
        },
      },
      {
        role: 'togglefullscreen',
      },
      {
        type: 'separator',
      },
      {
        label: 'Add Item',
        click() {
          createAddWindow()
        },
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear')
        },
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        },
      },
    ],
  },
]

// If mac, add empty
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({}) // <-- add at begainng of array
}

// Add developer tools item if not in production
if (process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        },
      },
      {
        role: 'reload',
      },
    ],
  })
}
