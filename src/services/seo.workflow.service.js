const axios = require("axios");
const { getJson } = require("serpapi");
const { SERP_API_KEY } = require("../configs/server.config");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");
const cheerio = require("cheerio");
const { chatGPTProcess } = require("./workflow.service");
const { SEO_PROMPT } = require("../utils/prompts");

const getTopThreeUrls = async (keywords) => {
  try {
    // console.log(keywords);
    const searchResult = await getJson({
      engine: "google",
      q: keywords,
      api_key: SERP_API_KEY,
    });
    console.log(searchResult);
    const searchResults = searchResult.organic_results;
    // console.log(searchResults);
    if (searchResults && searchResults.length > 0) {
      const topUrls = searchResults.slice(0, 3).map((result) => result.link);
      return topUrls;
    } else {
      throw new AppErrors(
        "SystemError",
        error?.message,
        "Error while getting top urls",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  } catch (error) {
    throw new AppErrors(
      "SystemError",
      error?.message,
      "Error while getting top urls",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const scrapeUrl = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const h2Tags = [];
    $("h2").each((index, element) => {
      h2Tags.push($(element).text());
    });

    const metaTags = $("meta");
    let metadata = {};
    metaTags.each((index, element) => {
      const name = $(element).attr("name") || $(element).attr("property");
      const content = $(element).attr("content");
      if (name && content) {
        metadata[name] = content;
      }
    });

    const metaSummary = {
      title: $("title").text(),
      meta: metadata,
    };

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    // const temp = {
    //   meta: Object.entries(metaSummary.meta)
    //     .map(([key, value]) => `${key}: ${value}`)
    //     .join("\n"),
    // };

    return { h2Tags, website_body: bodyText.replace(/\n/g, "\\n") };
  } catch (error) {
    console.error("Error fetching the page:", error);
    return [];
  }
};
const extractSection = (response, sectionTitle) => {
  const regex = new RegExp(`${sectionTitle}:([\\s\\S]*?)(?=\\n\\n|$)`, "i");
  const match = response.match(regex);
  console.log(match);
  if (match && match[1]) {
    return match[1]
      .trim()
      .split("\n")
      .map((line) => line.trim().replace(/^- /, ""));
  }
  return [];
};

const processSEOWorkflow = async (keywords) => {
  try {
    const topThreeUrls = await getTopThreeUrls(keywords);

    var firstUrlScraping = await scrapeUrl(topThreeUrls[0]);

    if (topThreeUrls.length >= 2) {
      var secondUrlScraping = await scrapeUrl(topThreeUrls[1]);
    }
    if (topThreeUrls.length >= 3) {
      var thirdUrlScraping = await scrapeUrl(topThreeUrls[2]);
    }

    const message = [
      {
        role: "system",
        content: SEO_PROMPT,
      },
      {
        role: "user",
        content: `Given the following inputs:
            1. Keywords: ${keywords}
            2. H2 Headings from the top three ranked pages:
               - Page 1: ${firstUrlScraping.h2Tags}
               - Page 2: ${secondUrlScraping.h2Tags}
               - Page 3: ${thirdUrlScraping.h2Tags}`,
      },
    ];
    const chatResponse = await chatGPTProcess(message);
    console.log(chatResponse);
    const urls = {
      first_url: topThreeUrls[0],
      second_url: topThreeUrls[1],
      third_url: topThreeUrls[2],
    };
    const recommendPage = extractSection(chatResponse, "Recommend Page Type");

    console.log(recommendPage);
    const potentialQuestion = extractSection(
      chatResponse,
      "Brainstorm Potential Questions"
    );
    const blogTitles = extractSection(chatResponse, "Generate Blog Titles");
    const urlSlugs = extractSection(chatResponse, "Generate URL Slugs");
    const outline = extractSection(chatResponse, "Create an Outline");
    const metaDescription = extractSection(
      chatResponse,
      "Generate Meta Description"
    );

    return {
      "Extract Top 3 URLs": urls,
      "Scan First URL": firstUrlScraping.website_body,
      "Extract H2s from first URL": firstUrlScraping.h2Tags,
      "Scan Second URL": secondUrlScraping.website_body,
      "Extract H2s from Second URL": secondUrlScraping.h2Tags,
      "Scan Third URL": thirdUrlScraping.website_body,
      "Extract H2s from Third URL": thirdUrlScraping.h2Tags,
      "Recommend Page Type": recommendPage,
      "Brainstorm Questions": potentialQuestion,
      "Brainstorm Blog titles": blogTitles,
      "Generate URL Slug": urlSlugs,
      "Generate Outline": outline,
      "Generate Meta Description": metaDescription,
      //   "Final Content Brief": chatResponse,
    };
  } catch (error) {
    if (error?.name == "SystemError") {
      throw error;
    }
    throw new AppErrors(
      "SystemError",
      error?.message,
      "Error while getting top urls",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = processSEOWorkflow;
