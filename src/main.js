// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Quit app when closed
  mainWindow.on('closed', function () {
    app.quit()
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

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
app.whenReady().then(() => {
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
  const addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Item',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // and load the index.html of the app.
  addWindow.loadFile(path.join(__dirname, 'addWindow.html'))
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Create menu template

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Developing Tool',
        click() {
          new BrowserWindow.fromWebContents.openDevTools()
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
