# WSBrowserExtension Setup

This guide provides instructions for setting up the WSBrowserExtension from GitHub.

## Download the Project

Option 1: Download ZIP
* Go to https://github.com/mmust08/WSBrowserExtension
* Click the green "Code" button
* Choose "Download ZIP"
* Extract the ZIP file on your computer

Option 2: Clone with Git
* Open your terminal
* Run: `git clone https://github.com/mmust08/WSBrowserExtension.git`

## Configure the Extension

1. Open your browser's extension page:
   * Chrome: `chrome://extensions/`
   * Firefox: `about:addons` then click "Extensions"
   * Edge: `edge://extensions/`

2. Enable "Developer mode"

3. Click "Load unpacked" or "Load Temporary Add-on"

4. Select the folder containing the extension files (where you see `manifest.json`)

5. The WSBrowserExtension should now appear in your browser

## Troubleshooting

* If the extension doesn't appear, make sure you've selected the correct folder containing the `manifest.json` file.
* Check the browser's console for any error messages related to the extension.
* Ensure that all the files mentioned in the `manifest.json` are present in the project folder.

## Update the Extension

* If you downloaded ZIP: Re-download and replace the old files
* If you used Git: In the project folder, run `git pull origin main`
* Refresh the extension in your browser's extension page

For help, check the [repository issues](https://github.com/mmust08/WSBrowserExtension/issues) or contact the developer.