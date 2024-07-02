const axios = require("axios");
const { getJson } = require("serpapi");
const { SERPER_API_KEY } = require("../configs/server.config");
const AppErrors = require("../utils/error-handling");
const { StatusCodes } = require("http-status-codes");
const cheerio = require("cheerio");
const { chatGPTProcess } = require("./student.workflow.service");
const { SEO_PROMPT } = require("../utils/prompts");

const getTopThreeUrls = async (keywords) => {
  try {
    console.log(keywords);
    let data = JSON.stringify({
      q: keywords,
    });
    let config = {
      method: "POST",
      url: "https://google.serper.dev/search",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    const searchResult = await axios.request(config);
    console.log(searchResult);
    const searchResults = searchResult.data.organic;
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

    // const getFirstNWords = (text, wordCount) => {
    //   return;
    // };
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const first400Words = bodyText.split(" ").slice(0, 400).join(" ");

    const temp = Object.entries(metaSummary.meta)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    return { h2Tags, website_body: first400Words };
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

const processSEOWorkflow = async (keywords, res) => {
  try {
    const topThreeUrls = await getTopThreeUrls(keywords);

    var firstUrlScraping = await scrapeUrl(topThreeUrls[0]);

    if (topThreeUrls.length >= 2) {
      var secondUrlScraping = await scrapeUrl(topThreeUrls[1]);
    }
    if (topThreeUrls.length >= 3) {
      var thirdUrlScraping = await scrapeUrl(topThreeUrls[2]);
    }
    var format = {
      recommend_page_type:
        "detailed response for recommend page type based on input. (IN MARKDOWN FORMAT)",
      brainstorm_questions: "1.question_1 \n 2. question_2",
      brainstorm_blog_titles: "1.blog_title_1 \n 2.blog_title_2",
      generated_url_slugs: "1.url_slug_1 \n 2.url_slug_2",
      generated_outline:
        "##<h2>h2_tag_1_title</h2> \n -h2_tag_1_subtopics \n ##<h2>h2_tag_2_title</h2> \n -h2_tag_2_subtopics",
      generated_meta_description: "meta description",
      final_content_brief: "Combined content of results",
    };
    format = JSON.stringify(format);
    const message = [
      {
        role: "system",
        content: SEO_PROMPT + `GENERATE IN JSON with this format: ${format}`,
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
    var chatResponse = await chatGPTProcess(message, "gpt-4o", "", {
      type: "json_object",
    });
    console.log(chatResponse);
    const urls = {
      first_url: topThreeUrls[0],
      second_url: topThreeUrls[1],
      third_url: topThreeUrls[2],
    };
    // const recommendPage = extractSection(chatResponse, "Recommend Page Type");

    // console.log(recommendPage);
    // const potentialQuestion = extractSection(
    //   chatResponse,
    //   "Brainstorm Potential Questions"
    // );
    // const blogTitles = extractSection(chatResponse, "Generate Blog Titles");
    // const urlSlugs = extractSection(chatResponse, "Generate URL Slugs");
    // const outline = extractSection(chatResponse, "Create an Outline");
    // const metaDescription = extractSection(
    //   chatResponse,
    //   "Generate Meta Description"
    // );
    chatResponse = JSON.parse(chatResponse);

    return {
      "Extract Top 3 URLs": urls,
      "Scan First URL": firstUrlScraping.website_body,
      "Extract H2s from first URL": firstUrlScraping.h2Tags,
      "Scan Second URL": secondUrlScraping.website_body,
      "Extract H2s from Second URL": secondUrlScraping.h2Tags,
      "Scan Third URL": thirdUrlScraping.website_body,
      "Extract H2s from Third URL": thirdUrlScraping.h2Tags,
      ...chatResponse,
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
