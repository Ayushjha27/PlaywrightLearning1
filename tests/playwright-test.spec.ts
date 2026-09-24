import { test, expect, request } from "@playwright/test";
import path from "path";
import fs from "fs";

// run a specific test command
// npx playwright test tests/playwright-test.spec.ts --grep "File Downloading"

test("First Playwright Test", async ({ page }) => {
  await page.goto("http://way2automation.com");
  const title = await page.title();
  console.log(title);

  // assertion-   expect(WHAT_TO_CHECK).WHAT_SHOULD_IT_HAVE()
  //expect(actual).toBe(expected)
  expect(title).toContain("Way2Automation");

  /*
  - expect(value).toContain("text"); 
  => value already exists in memory → no await.

  - await expect(locator).toContainText("text");
  => If Playwright needs to interact with or check something in the browser → it's generally an async operation → returns a Promise → use await.
*/
  await page.goto("http://gmail.com");

  await page.waitForTimeout(2000);

  await page.goBack(); // browser Back
  await page.waitForTimeout(2000);
  await page.goForward(); // browser Forward
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForTimeout(2000);
});

test("Finding Elements", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://gmail.com");

  //await page.getByLabel('Email or phone',{exact: true}).fill("trainer@way2automation.com");

  // await page.locator("#identifierId").fill("trainer@way2automation.com");

  await page
    .locator('//*[@id="identifierId"]')
    .fill("trainer@way2automation.com");
  await page.locator("button").filter({ hasText: "Next" }).click();
  //filter({ hasText: '...' }) → checks text within the element + descendants.
  await page.getByLabel("Enter your password").fill("sdfsdffd");
  await page.locator('//*[@id="passwordNext"]/div/button/span').click();
  const errorMessage = await page
    .locator(
      '//*[@id="yDmH0d"]/c-wiz/div/div[2]/div/div/div/form/span/section[2]/div/div/div[1]/div[2]/div[2]/span',
    )
    .innerText();
  //innerText() → gets visible text from the element + descendants.
  console.log(errorMessage);
  expect(errorMessage).toContain("Wrong password");
  await page.waitForTimeout(2000);
});

test("Handing Dropdown", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://www.wikipedia.org/");

  // Select the option by its visible text/label. Here, select the option whose text is "Eesti"
  await page.selectOption("select", { label: "Eesti" });
  // Select the option by its value attribute. Example: <option value="hi">Hindi</option>
  await page.selectOption("select", { value: "hi" });
  // Select the option by its index.  index: 0 means the first option
  await page.selectOption("select", { index: 0 });

  // Find all <option> elements on the page
  // .all() returns all matching elements as an array of Locators
  const options = await page.locator("option").all();

  // .length gives the number of elements in the array
  console.log("Total values are : " + options.length);

  for (const option of options) {
    const text = await option.innerText();
    const lang = await option.getAttribute("lang");

    // Get the visible text inside the current <option>
    // Example: <option>Hindi</option> → "Hindi"
    // Get the value of the "lang" HTML attribute
    // Example: <option lang="hi"> → "hi"

    console.log(`${text} ---- ${lang}`);
  }

  await page.waitForTimeout(2000);
});

test("Handing Links", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://www.wikipedia.org/");

  const block = await page.locator('//*[@id="www-wikipedia-org"]/footer/nav');

  const links = await block.locator("a").all();

  console.log(links.length);

  for (const link of links) {
    const text = await link.innerText();
    const url = await link.getAttribute("href");
    console.log(`${text} --- ${url}`);
  }

  await page.waitForTimeout(2000);
});

test("assignment-1", async ({ page }) => {
  await page.goto("https://www.makemytrip.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const closeButton = page.locator("//span[@class='commonModal__close']");

  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  await page.waitForTimeout(300000);
  const locat = page.locator("//input[@placeholder='From']");

  console.log("Count:", await locat.count());
  await locat.click();

  console.log("clicked");

  const options = await locat
    .locator("//span[@class='revampedPillText']")
    .all();

  console.log("Total values are : " + options.length);

  for (const option of options) {
    const text = await option.innerText();

    console.log(`${text}`);
  }
});

test("Handing Checkboxes", async ({ page }) => {
  await page.goto("http://www.tizag.com/htmlT/htmlcheckboxes.php");

  const block = await page.locator(
    "xpath=/html/body/table[3]/tbody/tr[1]/td[2]/table/tbody/tr/td/div[4]",
  );
  const Checkboxes = await block.locator('[name="sports"]');
  const checkboxesCount = await Checkboxes.count();
  console.log(checkboxesCount);

  for (let i = 0; i < checkboxesCount; i++) {
    await Checkboxes.nth(i).click();
  }

  await page.waitForTimeout(2000);
});

//-----------------------------------------------------------//

/*

Iterate elements:

1. using for loop + .count() + .nth()
const checkboxes = block.locator('[name="sports"]');

for (let i = 0; i < await checkboxes.count(); i++) {
  await checkboxes.nth(i).click();
}


2. Using for....of loop + .all():

const checkboxes = await block.locator('[name="sports"]').all();

for (const checkbox of checkboxes) {
  await checkbox.click();
}

3. Using .all() + length +  for loop + index

const checkboxes = await block.locator('[name="sports"]').all();

for (let i = 0; i < checkboxes.length; i++) {
  await checkboxes[i].click();
}

🔥 Remember this
locator() → one Locator object that can represent multiple matching elements.
.all() → converts the matching elements into an array of individual Locator objects.

*/

test("Assertions", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://www.tizag.com/htmlT/htmlcheckboxes.php");

  await expect(page).toHaveURL("http://www.tizag.com/htmlT/htmlcheckboxes.php");
  console.log("URL Assertion passed");

  await expect(page).not.toHaveURL(/error/);
  console.log("No errors on teh page hence passed");

  await expect(page).toHaveTitle("HTML Tutorial - Checkboxes");
  console.log("Title assertion passed");

  const link = page.locator('xpath=//*[@id="menu"]/a[19]');
  await expect(link).toHaveText("HTML - Tags");
  console.log("Text assertion passed");

  const checkbox = page.locator(
    "xpath=/html/body/table[3]/tbody/tr[1]/td[2]/table/tbody/tr/td/div[4]/input[1]",
  );
  await expect(checkbox).toBeVisible();
  console.log("Checkbox is visible");

  await checkbox.click();

  await expect(checkbox).toBeChecked();
  console.log("checkbox is checked");

  await page.waitForTimeout(2000);
});

test("webtables", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://money.rediff.com/indices/nse/NIFTY-50?src=moneyhome_nseIndices",
  );

  const rowCount = await page
    .locator("#leftcontainer > table > tbody > tr")
    .count();
  console.log("Row count is  : " + rowCount);

  const colCount = await page
    .locator("#leftcontainer > table > tbody > tr:nth-child(1) > td")
    .count();
  console.log("Col count is  : " + colCount);

  const text = page.locator(
    "#leftcontainer > table > tbody > tr:nth-child(1) > td:first-child",
  );
  await expect(text).toContainText("Adani");
  console.log(await text.innerText());

  const allInnerTexts = await page
    .locator("#leftcontainer > table > tbody > tr")
    .allInnerTexts();

  for (const tableText of allInnerTexts) {
    console.log(tableText);
  }
  await page.waitForTimeout(3000);
});

/*
-> innerText() returns String used when you want text from one element
-> allInnerTexts()	returns Array of strings	used when you want text from multiple matching elements

=> for...of + .all() to print table data.
const cells = await page.locator('table td').all();

- Print every row
const rows = await page.locator('table tr').all();

for (const row of rows) {
  console.log(await row.innerText());
}

- Print every cell
const cells = await page.locator('table td').all();

for (const cell of cells) {
    console.log(await cell.innerText());
}

-Row + column wise ⭐

const rows = await page.locator('table tr').all();

for (const row of rows) {
    const cells = await row.locator('td').all();

    for (const cell of cells) {
        console.log(await cell.innerText());
    }
}

*/

//Shadow DOM is a separate DOM tree attached to an element, used to encapsulate its HTML and CSS.
//JavaScript can access the shadow root using .shadowRoot,playwright generally handles open Shadow DOM automatically with its locators.
// Playwright's normal locators cannot pierce a closed Shadow DOM.

test("Shadow Root Element", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("chrome://downloads/");
  await page.waitForTimeout(3000);
  await page.locator("#searchInput").fill("Playwright");
  await page.waitForTimeout(3000);
});

test("Mouse Hover Element", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://www.way2automation.com/");

  await page.locator('//*[@id="menu-item-27580"]/a/span[2]').hover();
  await page.locator('//*[@id="menu-item-27581"]/a').click();

  await page.waitForTimeout(3000);
});

test("Slider Movement", async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 580 });
  await page.goto("https://jqueryui.com/resources/demos/slider/default.html");

  const slider = await page.locator('//*[@id="slider"]/span');

  /* 
  The bounding box is calculated relative to the main frame viewport and
  gives the position and size of the slider handle

    // boundingBox() returns information such as:
    // x      → How far the element's left edge is from the left side of the viewport.
    // y      → How far the element's top edge is from the top of the viewport.
    // width  → width of the element
    // height → height of the element
    */

  //     x, y = top-left corner
  // width, height = size of the rectangle
  const boundingBox = await slider.boundingBox();
  await page.waitForTimeout(3000);

  // boundingBox() can return null if the element is not visible
  // Therefore, we first check that boundingBox contains a value.
  if (boundingBox) {
    //Find the center of the slider handle and start the drag from there.
    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(startX, startY); // Move the mouse to the center of the slider handle
    await page.mouse.down(); // Press and hold the left mouse button
    await page.mouse.move(startX + 400, startY); // Move the mouse 400 pixels to the right
    await page.mouse.up(); // Release the left mouse button

    //move → down → move → up = manual drag operation using mouse coordinates.
  }
  await page.waitForTimeout(3000);
});

test("Resizable Element", async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 580 });
  await page.goto(
    "https://jqueryui.com/resources/demos/resizable/default.html",
  );
  await page.waitForTimeout(3000);

  const resizable = await page.locator('//*[@id="resizable"]/div[3]');

  const boundingBox = await resizable.boundingBox();
  await page.waitForTimeout(3000);
  if (boundingBox) {
    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 400, startY + 400);
    await page.mouse.up();
  }

  await page.waitForTimeout(3000);
});

test("Drag and Drop", async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 580 });
  await page.goto(
    "https://jqueryui.com/resources/demos/droppable/default.html",
  );
  await page.waitForTimeout(2000);

  const draggable = page.locator("#draggable");
  const droppable = page.locator("#droppable");

  const draggableBox = await draggable.boundingBox();
  const droppableBox = await droppable.boundingBox();

  if (draggableBox && droppableBox) {
    await page.mouse.move(
      draggableBox.x + draggableBox.width / 2,
      draggableBox.y + draggableBox.height / 2,
    );

    await page.mouse.down();

    await page.mouse.move(
      droppableBox.x + droppableBox.width / 2,
      droppableBox.y + droppableBox.height / 2,
    );

    await page.mouse.up();
  }

  await page.waitForTimeout(3000);
});

test("Right Click action", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://deluxe-menu.com/popup-mode-sample.html");
  await page.locator("//p[2]/img").click({ button: "right" });

  await page
    .locator("//td[contains(@id,'dm2m1i0tdT') and text()='Home']")
    .click();

  console.log("Page title is " + (await page.title()));
  await page.waitForTimeout(3000);
});

test("Handling Alerts", async ({ page }) => {
  //You need to start listening before the action that causes the dialog.
  page.on("dialog", async (xyz) => {
    await page.waitForTimeout(2000);
    console.log(xyz.message());
    await xyz.accept();
  });

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://mail.rediff.com/cgi-bin/login.cgi");

  await page.locator(".signin-btn").click();

  await page.waitForTimeout(3000);
});

test("Handling IFrames", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit",
  );

  const frame = page.frameLocator("#iframeResult");

  await frame.locator("#fname").fill("Rahul");
  await frame.locator("#lname").fill("Arora");

  await frame.locator('[type="submit"]').click();

  await page.waitForTimeout(3000);
});

test("Handling Tabs and Popups", async ({ page }) => {
  // Set the browser viewport size to 1920 × 1080
  await page.setViewportSize({
    width: 1080,
    height: 580,
  });

  // Open the main practice website
  await page.goto(
    "https://www.way2automation.com/way2auto_jquery/automation-practice-site.html",
  );

  // Click the element that opens a NEW TAB/POPUP
  //
  // Promise.all() is used because:
  // 1. We need to start listening for the popup
  // 2. We need to click the element that opens the popup
  //
  // Both happen together.
  const [newTab] = await Promise.all([
    // Wait for a new tab/popup to be opened
    page.waitForEvent("popup"),

    // Click the element that opens the new tab
    page.locator('//*[@id="wrapper"]/div/div/div[3]/ul/li/a/figure').click(),
  ]);

  // Wait until the newly opened tab finishes loading
  await newTab.waitForLoadState();

  // Get all frames present inside the new tab
  //
  // frames()[0] → main page frame
  // frames()[1] → first iframe
  //
  // JavaScript array indexing starts from 0.
  const iframe = newTab.frames()[1];

  // Inside the iframe, click "New Browser Tab"
  //
  // This click opens ANOTHER new tab.
  const [secondTab] = await Promise.all([
    // Wait for the second tab to open
    newTab.waitForEvent("popup"),

    // Find "New Browser Tab" inside the iframe and click it
    iframe.locator("text=New Browser Tab").click(),
  ]);

  // Wait until the second tab finishes loading
  await secondTab.waitForLoadState();

  // Get and print the title of the second tab
  const secondTabTitle = await secondTab.title();

  console.log(secondTabTitle);

  // Wait 3 seconds so we can observe the second tab
  await page.waitForTimeout(3000);

  // Close the second tab
  await secondTab.close();

  // Wait 3 seconds so we can observe that the second tab is closed
  await page.waitForTimeout(3000);

  // Close the first newly opened tab
  await newTab.close();

  // Wait 3 seconds before the test finishes
  await page.waitForTimeout(3000);
});

test("Javascript Execution", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit",
  );

  const frame = page.frameLocator("#iframeResult");
  await frame.locator("#fname").fill("");
  await frame.locator("#fname").fill("Rahul");
  await frame.locator("#lname").fill("");
  await frame.locator("#lname").fill("Arora");

  //In Playwright, evaluate() means: run JavaScript inside the web page (browser context).
  await frame.locator('[type="submit"]').evaluate((element: HTMLElement) => {
    element.style.border = "3px solid red";
  });

  await page.waitForTimeout(3000);
});

test("Capturing Screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit",
  );

  const frame = page.frameLocator("#iframeResult");
  await frame.locator("#fname").fill("");
  await frame.locator("#fname").fill("Rahul");
  await frame.locator("#lname").fill("");
  await frame.locator("#lname").fill("Arora");

  await frame.locator('[type="submit"]').evaluate((element: HTMLElement) => {
    element.style.border = "3px solid red";
  });

  //Captures only a specific element.
  await frame
    .locator('[type="submit"]')
    .screenshot({ path: "screenshot/submit.png" });

  // Full Page Screenshot
  await page.screenshot({ path: "screenshot/screenshot.png", fullPage: true });

  //Captures only the currently visible browser viewport.
  await page.screenshot({ path: "screenshot/viewport.png" });

  await page.waitForTimeout(3000);
});

//HTTP Authentication means the server asks the client for credentials (usually username + password) before allowing access to a protected resource.

test("Http Authentication", async ({ browser }) => {
  // Create a new browser context
  // A browser context is like a separate browser session.The context can have its own:
  //cookies,local storage,session,authentication,permissions,HTTP credentials
  // We provide the username and password that the website
  // requires for HTTP Basic Authentication.
  const context = await browser.newContext({
    httpCredentials: {
      username: "admin",
      password: "admin",
    },
  });

  //newContext() takes an options object, and httpCredentials is a key whose value is another object containing username and password as keys.

  // Create a new page (tab) inside that new browser context
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Open the website
  // Playwright automatically sends the username and password
  // configured above when the website asks for HTTP authentication.
  await page.goto("https://the-internet.herokuapp.com/basic_auth");

  await page.waitForTimeout(3000);
});

test("File Upload", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://www.way2automation.com/way2auto_jquery/registration.php#load_box",
  );

  await page
    .locator("#register_form > fieldset:nth-child(9) > input[type=file]")
    .setInputFiles(
      "C:\\Users\\way2automation\\Desktop\\Udemy and Screenshots\\automation.jpg",
    );

  await page.waitForTimeout(3000);
});

test("Multiple File Upload", async ({ page }) => {
  /*
Important: multiple must be supported by the HTML
If the input is:
<input type="file">
➡️ Usually only one file can be selected.

If:
<input type="file" multiple>
➡️ Multiple files can be selected.
*/

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_fileupload_multiple",
  );

  const frame = page.frameLocator("#iframeResult");
  await frame
    .locator("#myFile")
    .setInputFiles([
      "C:\\Users\\way2automation\\Desktop\\Udemy and Screenshots\\mobile.jpg",
      "C:\\Users\\way2automation\\Desktop\\Udemy and Screenshots\\automation.jpg",
    ]);

  await page.waitForTimeout(3000);
});

test("File Downloading", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("https://www.selenium.dev/downloads/");

  const [download] = await Promise.all([
    page.waitForEvent("download"), //Listens for the download event

    page
      .locator("xpath=/html/body/div[1]/main/div[4]/div[2]/div/div/p[1]/a")
      .click(),
  ]);

  //__dirname gives the directory (folder) containing the current file — basically the parent folder of the current file.
  const projectDirectory = path.join(__dirname, "downloads");
  if (!fs.existsSync(projectDirectory)) {
    fs.mkdirSync(projectDirectory);
  }

  //path.join() builds the address; fs performs the filesystem operation at that address.
  const filePath = path.join(projectDirectory, "selenium.jar");

  await page.waitForTimeout(3000);
  await download.saveAs(filePath); //Saves the file to the specified path
  console.log("File Downloaded to : " + filePath);

  await page.waitForTimeout(3000);
});
