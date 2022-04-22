---
layout: layouts/post.njk
title: "Jump To Links SEO in SERP Snippet!"
tags: structured-data semantic-web
wikidata: Q15842350
wikidatas:
  - name: "Rich Snippet"
    url: "https://www.wikidata.org/wiki/Q15842350"
  - name: "HTML Anchor Link"
    url: "https://wikidata.org/wiki/Q3615202"
  - name: "Javascript"
    url: "wikidata.org/wiki/Q2005"
  - name: "Structured Data"
    url: "https://www.wikidata.org/wiki/Q26813700"
  - name: "URI Fragment"
    url: "https://en.wikipedia.org/wiki/URI_fragment"

genre: "https://en.wikipedia.org/wiki/Search_engine_optimization"
isbasedon: ["https://searchengineland.com/google-jump-to-links-within-search-snippets-26603", "https://googleblog.blogspot.com/2009/09/jump-to-information-you-want-right-from.html"]
business_occupation:
  name: "Search Marketing Strategists"
  code: "13-1161.01"
  date: 2021
excerpt: "Jump To Links in Rich Results that may provide additonal hyperlinks in the footer of your result that are clickable. This article shows you how to do that on any content plaform with a bit of javascript you copy/paste."
featured_image: serp-jump-to-links.png
image: serp-jump-to-links.png
twitdesc: "Add SERP Jump-To Links using Javascript to page headings with Javascript Script!"
jsontyp: howto
tweet_id: 1447989747494924289
twitter_platform: "Serp Jump-To Links"
twitter_totaltime: "30 Minutes"
author: member1
duration: 25
supply: "HTLM Document"
tool:
  - name: Genesis Page Footer Script
    description: "Jekyll is a simple, blog aware, static site generator."
    url: "https://my.studiopress.com/documentation/usage/genesis-features/add-header-footer-and-body-scripts/"
  - name: Text Editor
    description: "Text editor capable of saving files to UTF-8"
    url: ""
  - name: "WordPress Divi Add Scripts"
    description: Inject scripts into WordPress Divi Footers"
    url: "https://divi.works/custom-scripts-in-divi/"
  - name: "WordPress Theme Developer Inject Theme footer Scripts"
    description: "Enque script into theme footer on post/page et al."
    url: "https://developer.wordpress.org/themes/basics/including-css-javascript/"
steps:
  - name: "Copy Javascript Snippet From Source"
    description: "I've wrote the Javascript for you. Just inject into post/page footers."
    tip: "All files should be opened and saved with UTF-8 format."
    url: "#copy-code"
    image: "serp-jump-to-links-1.png"
    id: 1

  - name: "Add Javascript to Content footer Scripts"
    description: "Using your site framwork, copy to location that will add to page footer."
    tip: "Code relies on targeting the article CSS class name. Ensure that the class name matches in the script. I.E. .content-header"
    url: "#inject-code-footer"
    image: "serp-jump-to-links-2.png"
    id: 2

  - name: "Use Semantic Headings to Support Main Topic"
    description: "Remember Learning Outlines? Each sub-topic should support the main idea of the creative work!"
    tip: "Search For Google Trends. Input terms and find topics not keywords."
    url: "#semantic-headings"
    image: "serp-jump-to-links-3.png"
    id: 3

jsontype: howto
mainentity: ItemPage
related: true
breadcrumb: true
---
>search snippet shows how a page, as a whole, relates to a your query by excerpting content that appears near and around where your query terms show on the page. Now, it may provid links within the snippet to relevant sections of the page, making it faster and easier to find what you're looking for. @Google  Official Blog September 25, 2009

## Copy Javascript Snippet
<figure>
{% image "serp-jump-to-links-1.png", "serp jump-to links step:1", "320", "img-responsive" %}
<figcaption>Copy Javascript Snippet - Step: 1</figcaption>
</figure>
Copy the script in this snippet. Place it in the footer of the post/page.
<figure>
{% highlight javascript %}
<script>
  document
    .querySelector('.post-content')
    .querySelectorAll('h2,h3,h4,h5,h6')
    .forEach(function (heading) {
      if (heading.id)
        heading.innerHTML =
          '<a href="#' + heading.id + '" title="' + heading.innerText + '">' +
            heading.innerText +
          '<\/a>' +
          '<span class="anchor-icon">&#128279;<\/span>';
    });
</script>
{% endhighlight %}
<figcaption>Manipulating The DOM element of HTML h2, h3, h4, h5 and h6 to inject an anchor href tag.</figcaption>
</figure>
1. `.querySelector('.post-content')` Change that to the <abbr title="Cascasing Style Sheets">CSS</abbr> class assigned to `<article>`.
2. `<span class="anchor-icon">{% raw %}&#128279;{% endraw %} <\/span>` The HTML tag endings are escaped in javascript. You can change to any HTML Entity. See [**HTML Entities Unicode**](https://www.compart.com/en/unicode/html "HTML Entities")
3. If you do **NOT** desire to have icons to the right of jump links, Use this instead: 
<figure>
{% highlight javascript %}
<script>
  document
    .querySelector('.post-content')
    .querySelectorAll('h2,h3,h4,h5,h6')
    .forEach(function (heading) {
      if (heading.id)
        heading.innerHTML =
          '<a href="#' + heading.id + '" title="' + heading.innerText + '">' +
            heading.innerText +
          '<\/a>';
    });
</script>
{% endhighlight %}
<figcaption>Content Header Tag without header icon</figcaption>
</figure>

## Add Javascript to Content footer Scripts
<figure>
{% image "serp-jump-to-links-2.png", "Replace or Add Article Schma JSON-LD Step: 2", "320", "img-responsive" %}
<figcaption>Add Javascript to Content footer Scripts Step: 2"</figcaption>
</figure>
This will negate having to modify your headings content and insert a link fraqment to every heading. The implimentation varies, widly, for various platorms. A URI fragment must be preceeded with a # sign. Like `#some-link`. The javascript will take the heading name and hypyenate it as a URI fragment. Be piffy with your sub-headding titles. But, semantic in the taxonomy supporting the main concept.
## Semantic Headings
<figure>
{% image "serp-jump-to-links-3.png", "Semantic Headings Step: 3", "320", "img-responsive" %}
<figcaption>Semantic Headings Step: 3</figcaption>
</figure>

<abbr title="explain like I'm 5">**ELI5**</abbr> stands for _explain like I'm 5._

When people use it online, they're asking others to explain a complex or obscure topic in the simplest of terms. So, if taken literally, they would explain something in a way that a 5-year-old would understand. However, this acronym is rarely used literally. You are telling an <abbr title="Artificial Intelligence">AI</abbr> bot the facts about your Jekyll Article Schema post.

>Your content will boil down to the 3 V's! @DavidAmerland
<dl>
<dt>Volume</dt>
<dd>The number of posts about a given <strong>Entity</strong></dd>
<dt>Variety</dt>
<dd>Be it content types or a differing viewpoint about an <strong>Entity</strong></dd>
<dt>Veracity</dt>
<dd>Accurate facts about a given <strong>Entity</strong></dd>
</dl>

### Taxonomy Beyond H1 Tag
<dl>
<dt>Taxonomy</dt>
<dd>The branch of philosophical science concerned with classification of things</dd>
</dl>
Your headings should convey attributes around the main concept of your creative work. Let's conceptualize one of my favorite items -- _OATMEAL CAKES_!!
1. The h1 is the main concept
- h2's are attributes. "The Golden Crust" _mmmm_
- Another Sub-heading of "The Creamy Filling" _mmm again!_
  - You can also nest h3's beneath sub-topics to convey hierarchy!
  - "Calories Count" P tag of Absolutely ZERO calories! I swear! LOL!

Search Engines are trying to fulfill query intent. If your sub-headings contain relevant terms, it may show up as _jump-to_ links in the serp rich snippet box. And, that's what we're after, all along!