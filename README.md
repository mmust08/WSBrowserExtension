# WSBrowserExtension Setup

This README provides instructions for downloading a browser extension project from GitHub and configuring it in your browser.

## Downloading the Project

### Option 1: Download as ZIP

* Navigate to the GitHub repository `https://github.com/mmust08/WSBrowserExtension`.
* Click on the green "Code" button near the top-right of the page.
* Select "Download ZIP" from the dropdown menu.
* Once downloaded, extract the ZIP file to your desired location.

### Option 2: Clone via Git

* Open your terminal or command prompt.
* Navigate to the directory where you want to clone the repository.
* Run the following command, replacing `https://github.com/mmust08/WSBrowserExtension.git` with the actual URL of the GitHub repository:
  ```
  git clone https://github.com/mmust08/WSBrowserExtension.git
  ```
* Wait for the cloning process to complete.

## Configuring the Extension in Your Browser

1. Open your browser's extension management page:
   * For Chrome: Enter `chrome://extensions/` in the address bar.
   * For Firefox: Enter `about:addons` in the address bar and click on "Extensions".
   * For Edge: Enter `edge://extensions/` in the address bar.

2. Enable "Developer mode" (usually a toggle switch in the top-right corner).

3. Click on "Load unpacked" (Chrome/Edge) or "Load Temporary Add-on" (Firefox).

4. Navigate to the directory where you extracted or cloned the extension files.

5. Select the main folder of the extension (it should contain the `manifest.json` file).

6. Click "Select Folder" (Chrome/Edge) or choose the `manifest.json` file (Firefox).

7. The extension should now appear in your browser's extension list.

8. If required, click on the extension icon in the browser toolbar to configure any additional settings.

## Troubleshooting

* If the extension doesn't appear, make sure you've selected the correct folder containing the `manifest.json` file.
* Check the browser's console for any error messages related to the extension.
* Ensure that all the files mentioned in the `manifest.json` are present in the project folder.

## Updating the Extension

* If you downloaded the ZIP, re-download and replace the files when an update is available.
* If you used Git, navigate to the project folder in the terminal and run:
  ```
  git pull origin main
  ```
* After updating, refresh the extension in your browser's extension management page.

For more detailed information or if you encounter any issues, please refer to the extension's documentation or reach out to the project maintainers.
