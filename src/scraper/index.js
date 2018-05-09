import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';

const BATCH_SIZE = 20;
const ENDPOINT_URL = 'http://localhost:5000/api';

let items_processed = 0;

const UNIQUE_ITEM_PARAMS = offset =>
  qs.stringify({
    action: 'cargoquery',
    tables: 'items',
    fields:
      'name,rarity,required_level,class,drop_level,drop_leagues,drop_areas,required_dexterity,required_intelligence,required_strength,flavour_text,tags,inventory_icon,base_item,implicit_mods,explicit_mods',
    where: 'rarity="Unique"',
    limit: BATCH_SIZE,
    offset,
    'order by': 'name',
    format: 'json'
  });

const MOD_PARAMS = modId =>
  qs.stringify({
    action: 'cargoquery',
    tables: 'mods,mod_stats',
    'join on': 'mods._pageName=mod_stats._pageName',
    where: `mods.id="${modId}"`,
    fields: 'mod_stats.min,mod_stats.max,mod_stats.id,mods.stat_text_raw',
    limit: 10,
    format: 'json'
  });

const processMods = modString =>
  Promise.all(
    modString.split(',').map(mod =>
      axios
        .post('https://pathofexile.gamepedia.com/api.php', MOD_PARAMS(mod), {
          headers: { 'Api-User-Agent': 'JSONofExile1' }
        })
        .then(modRes => modRes.data.cargoquery)
        .then(modData => {
          const mod = {};
          modData.forEach(({ title }) => {
            mod.text = title['stat text raw'];

            title.min = parseInt(title.min);
            title.max = parseInt(title.max);

            if (title.id.includes('minimum')) {
              mod.min = {
                min: title.min,
                max: title.max
              };
            } else if (
              title.id.includes('maximum') &&
              !title.id.includes('life')
            ) {
              mod.max = {
                min: title.min,
                max: title.max
              };
            } else {
              mod.min = { min: title.min, max: title.min };
              mod.max = { min: title.max, max: title.max };
            }
          });
          return mod;
        })
    )
  );

const makeGraphQLRequest = item => {
  axios
    .post(ENDPOINT_URL, {
      query: `
      mutation AddItem($data: ItemInput) {
        addItem(data: $data) {
          _id
        }
      }
    `,
      variables: {
        data: item
      }
    })
    .then(res => res.data)
    .then(() => {
      items_processed += 1;
      console.log('items processed:', items_processed);
    })
    .catch(err => console.log(err));
};

const clearDatabase = () =>
  axios.post(ENDPOINT_URL, {
    query: `
      mutation clear {
        clear
      }
    `,
    variables: {
      clear: 'clear'
    }
  });

const getItems = async () => {
  for (let offset = 0; offset < 1000; offset += BATCH_SIZE) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    axios
      .post(
        'https://pathofexile.gamepedia.com/api.php',
        UNIQUE_ITEM_PARAMS(offset),
        {
          headers: { 'Api-User-Agent': 'JSONofExile' }
        }
      )
      .then(res => res.data.cargoquery)
      .then(data =>
        data.forEach(({ title }) =>
          Promise.all([
            processMods(title['implicit mods']),
            processMods(title['explicit mods'])
          ]).then(results => {
            const item = {
              name: title.name,
              rarity: title.rarity.toUpperCase(),
              levelReq: parseInt(title['required level']),
              class: title.class
                .toUpperCase()
                .split(' ')
                .join('_'),
              dropLevel: parseInt(title['drop level']),
              leagues: title['drop leagues']
                ? title['drop leagues']
                  .split(',')
                  .map(league => league.toUpperCase())
                : null,
              dropAreas: title['drop areas'] || null,
              statReq: {
                str: parseInt(title['required strength']),
                dex: parseInt(title['required dexterity']),
                int: parseInt(title['required intelligence'])
              },
              flavor: title['flavour text'],
              tags: title.tags.split(','),
              icon: title['inventory icon'],
              base: title['base item'],
              implicitMods: results[0],
              explicitMods: results[1]
            };
            makeGraphQLRequest(item);
          })
        )
      );
  }
};

const scrapeImageUrl = file =>
  new Promise(resolve => {
    axios
      .get(`https://pathofexile.gamepedia.com/${file}`)
      .then(res => res.data)
      .then(page => {
        const $ = cheerio.load(page);
        resolve($(`[alt="${file}"]`).attr('src'));
      });
  });

const updateImageUrls = () =>
  axios
    .post(ENDPOINT_URL, {
      query: `
      query GetItem {
        items(query: {}) {
          _id
          icon
        }
      }
    `
    })
    .then(res => res.data.data.items)
    .then(items => {
      items.forEach(async item => {
        const iconSrc = await scrapeImageUrl(item.icon);
        axios.post(ENDPOINT_URL, {
          query: `
          mutation UpdateItem($_id: String, $fields: ItemInput) {
            updateItem(_id: $_id, fields: $fields) {
              _id
              icon
            }
          }
        `,
          variables: {
            _id: item._id,
            fields: {
              icon: iconSrc
            }
          }
        });
      });
    });

async function run() {
  console.log('Clearing Database');
  await clearDatabase();
  console.log('Database cleared');
  console.log('Parsing Items from Path of Exile wiki');
  await getItems();
  console.log('Done parsing Items from Path of Exile wiki');
  console.log('Scraphing icon urls for items');
  await updateImageUrls();
  console.log('Done scraphing icon urls for items');
}

run();
