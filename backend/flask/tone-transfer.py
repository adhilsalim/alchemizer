"""
Original Author: Amarnath C (github.com/RoseLoverX)
Modified By: Adhil Salim (github.com/adhilsalim)

Description:
This script was written by Amarnath for alchemizer, thanks to him for the script.
It is used to download the transformed audio files from the Tone Transfer website.
"""

from pyppeteer import launch
import asyncio
import sys
import bs4
import warnings
from pprint import pprint
from aiohttp import web


# check the length of args, if < 3, print usage and exit
if(len(sys.argv) < 3):
    print('Usage: python tone.py <input_audio_file> <output_audio_file>')
    sys.exit(1)

print('args:', sys.argv)

async def serve_blob_proxy(request):
    html_template = '''
    <html>
<body>
    <button id="1" onclick="a()"></button>
    <script>
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const url = params.get('url');
        let fn = async (URI) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', URI, true);
            xhr.responseType = 'blob';

            xhr.onload = function (e) {
                if (this.status == 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);

                    reader.onloadend = function () {
                        base64data = reader.result;
                        document.getElementById('1').innerHTML = base64data;
                    }
                }
            };

            xhr.send();
        }

        let a = async () => {
            await fn(url);
        }

        document.getElementById('1').click();
    </script>
</body>
</html>'''
    return web.Response(text=html_template, content_type='text/html')

warnings.filterwarnings("ignore")

initial_cookies = [
    {
        "name": "hasSeenVignette",
        "value": "1",
        "domain": "sites.research.google",
        "path": "/",
        "httpOnly": False,
        "secure": False,
       # "expires": 1713812460.076346
    },
    {
        "name": "hasAcceptedCookieBar",
        "value": "1",
        "domain": "sites.research.google",
        "path": "/",
        "httpOnly": False,
        "secure": False,
        "expires": -1
    }
]

INPUT_FILE = sys.argv[1]


async def main():
    transformations = []
    asyncio.create_task(start_server())
    print('server started')

    if sys.platform == 'win32':
        browser = await launch({
            'headless': False,
            'args': ['--no-sandbox'],
            'executablePath': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'args': ['--mute-audio', '--allow-file-access-from-files', '--disable-web-security']})
        print('browser launched')
    else: # linux/mac
        browser = await launch({
            'headless': False,
            'args': ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security', '--allow-file-access-from-files', '--mute-audio']
        })

    page = await browser.newPage()
    print('page created')
    
    # page.setRequestInterception(True)

    await page.setCookie(*initial_cookies)
    await page.goto('https://sites.research.google/tonetransfer')
    print('page loaded')

    # wait for div with class 'intro__buttons' to appear
    # then click first button in the div
    await page.waitForSelector('.intro__buttons')
    await page.click('.intro__buttons button')
    print('clicked first button')

    # button with class 'MuiButtonBase-root dialog__btn' appears in 3 seconds
    # click the button

    try:
        await page.waitForSelector('.MuiButtonBase-root.dialog__btn', timeout=3000)
        await page.click('.MuiButtonBase-root.dialog__btn')
        print('clicked dialog__btn')
    except:
        pass

    try:
        await page.evaluate('document.querySelector("#react-root > div.main > div.main__content > div.controls.moving-down > div.container.container--full-height > div > nav.controls--input > ul > li:nth-child(7) > span").click()')
        print('clicked input')
    except:
        pass

    # if input recorder__input is visible, upload aud.mp3 file

    try:
        await page.waitForSelector('.recorder__input')
        input_x = await page.J('.recorder__input')
        await input_x.uploadFile(INPUT_FILE)
        print('uploaded file')

        # wait 30 secs for MuiButtonBase-root button button--primary recorder__button
        # to appear and click it

        # wait for document.querySelector("#react-root > div.main > div.footer-container.footer-container--show-recorder > div > div > div > div:nth-child(2) > button") text to be 'Transform'
        # then click the button

        # find and click MuiButtonBase-root button button--primary recorder__button if clickable

        try:
            await page.waitForSelector('.MuiButtonBase-root.button.button--primary.recorder__button', timeout=30000)
            # check if clickable
            await page.evaluate('document.querySelector(".MuiButtonBase-root.button.button--primary.recorder__button").click()')
            print('clicked transform')
        except Exception as e:
            print('Error:', e)

        # wait for recorder__progress to disappear | 120 secs

        try:
            await page.waitForSelector('.recorder__progress', hidden=True, timeout=300000)
            print('transforming complete')
        except:
            print('TimeoutError: recorder__progress not hidden')

        # click MuiButtonBase-root player__controls__download
        await page.evaluate('document.querySelector(".MuiButtonBase-root.player__controls__download").click()')

        # get html of MuiDialogContent-root dialog__content--no-actions
        # and print it

        dialog_content = await page.evaluate('document.querySelector(".MuiDialogContent-root.dialog__content--no-actions").innerHTML')
        for i in bs4.BeautifulSoup(dialog_content, 'html.parser').find_all('a', class_="download-btn", href=True):
            print(i['href'])
            if "blob:" in i['href']:
                print('blob url found', i['href'])
                transformations.append({
                    "url": i['href'],
                    "name": i.get('download', 'unknown-transform')
                })
    except Exception as e:
        print('Error:', e)
    
    
            
    await page._client.send('Page.setDownloadBehavior', {'behavior': 'allow', 'downloadPath': sys.argv[2]})
    

    # now download the transformed audio files from the urls in transformations
    # use proxy server to download the files from blob memory
    for i in transformations:
        await page.goto("http://localhost:5500?url="+i['url'])
        # wait till button with id, textContent != ''
        await page.waitForFunction('document.getElementById("1").textContent != ""')
        # get base64 data
        base64data = await page.evaluate('document.getElementById("1").textContent')
        # write to file
        with open(i['name'], 'wb') as f:
            import base64
            f.write(base64.b64decode(base64data.split(',')[1]))

    pprint(transformations)
    await browser.close()
    
web_app = web.Application()
web_app.router.add_get('/', serve_blob_proxy)

async def start_server():
    runner = web.AppRunner(web_app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', 5500)
    await site.start()


asyncio.get_event_loop().run_until_complete(main())
