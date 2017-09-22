# Docker Image: (AJAX) Scraper Using Headless Chrome

Files for creating a Docker image containing a node service using Google's Puppeteer to run headless Chrome and scrape page HTML post-evaluation. Meaning, any JS/AJAX is carried out before the page is scraped.

## Usage Without Docker

Node is required for the scraper to work. You can find it, and installation instructions, here: https://nodejs.org/en/

Once Node is installed, open your terminal, and navigate to the folder containing the scraper files. Run the following command:

```
npm install
```

When the installation has finished, run the following command:

```
node scraper.js
```

Wait for the application to report that the browser is ready. Once it is, you should be able to navigate to localhost:8001/?url=https://google.com/ to see the output of the app.

## Notice

The following Docker setup has been tested on Ubuntu 16.04 LTS, and the (minimal) instructions below are from the perspective of that environment.

## Setup & Testing

Install Docker: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/

Navigate to the directory containing the files and run the following command:

```
docker build -t scraper .
```

The -t flag sets the tag-name of the image, and can be changed or omitted.

Once the image is finished building, run the following command:

```
docker run -p 46464:8001 -d scraper
```

This spins up the image we just built (using the tag name, scraper) as an active container and binds our port 46464 to the image's port 8001. The -d flag runs the image in detached mode, so that we can continue to use the terminal. You can freely change port 46464 to another port, if you so desire, though the instructions assume that you do not.

To test the scraper service on the image, assuming cURL is installed, run the following command:

```
curl localhost:46464/?url=https://google.com/
```

All being well, this should return the HTML of https://google.com/ as a text string. https://google.com/ can be substituted for any other URL, and the service will return the html of the given URL. Different pages take slightly longer or shorter to evaluate, but otherwise there is no change in usage method.

If you do not have curl installed, or do not want to use it, you can access the container's output by pointing your browser at: localhost:46464/?url=https://google.com/

## Closing

Once testing is over, shut down the container (with our image), by finding the container id using the following command:

```
docker ps
```

To stop the container, run the following command:

```
docker stop <Container ID>
```

