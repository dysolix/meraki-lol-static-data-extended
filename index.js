import axios from "axios";
import fs from "fs/promises"
import { snakeCaseToCamelCase } from "./util.js";
axios.defaults.adapter = "http";

const championRates = await axios.get("https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/championrates.json").then(res => res.data); // { data: { ... }, patch: "string" }
const champions = await axios.get("https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json").then(res => res.data); // Map: Champion id -> champion data
const items = await axios.get("https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json").then(res => res.data); // Map: Item id -> item data

const latest = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json").then(res => res.data[0]);
const dDragonItems = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/item.json`).then(res => res.data.data);

for(const key in champions) {
    const champion = snakeCaseToCamelCase(champions[key]);
    champions[key] = champion;
}

for(const key in items) {
    const item = snakeCaseToCamelCase(items[key]);
    item.maps = null;
    const dDragonItem = dDragonItems[key];
    if(dDragonItem) {
        item.maps = Object.keys(dDragonItem.maps).map(Number);
    }

    items[key] = item;
}

await fs.writeFile("./out/championrates.json", JSON.stringify(championRates));
await fs.writeFile("./out/champions.json", JSON.stringify(champions));
await fs.writeFile("./out/items.json", JSON.stringify(items));