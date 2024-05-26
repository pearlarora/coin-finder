// import axios from "axios";
// import express from "express";

// async function getCoinInfo(siteUrl) {
//   try {
//     const siteUrl =
//       "https://api.geckoterminal.com/api/v2/networks/trending_pools";
//     const { data } = await axios({
//       method: "GET",
//       url: siteUrl,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export default getCoinInfo;

// import axios from "axios";

// // Function to fetch data from the given API endpoint
// async function fetchData(url) {
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// }

// // Function to fetch data for each network ID
// async function fetchNetworkData(networkId) {
//   const trendingPoolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/trending_pools?page=1`;
//   // const poolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/pools`;
//   // const newPoolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/new_pools`;

//   const trendingPoolsData = await fetchData(trendingPoolsUrl);
//   // const poolsData = await fetchData(poolsUrl);
//   // const newPoolsData = await fetchData(newPoolsUrl);

//   return {
//     trendingPools: trendingPoolsData,
//     // pools: poolsData,
//     // newPools: newPoolsData,
//   };
// }

// // Function to fetch data for all networks
// async function fetchAllNetworksData() {
//   const networksUrl = "https://api.geckoterminal.com/api/v2/networks";
//   const networksData = await fetchData(networksUrl);

//   if (!networksData || !networksData.data) {
//     console.log("No data available");
//     return null;
//   }

//   const allNetworksData = [];

//   for (const network of networksData.data) {
//     const networkData = await fetchNetworkData(network.id);
//     allNetworksData.push({
//       networkId: network.id,
//       networkName: network.attributes.name,
//       data: networkData,
//     });
//   }

//   return allNetworksData;
// }

// // Sample usage
// async function getCoinInfo() {
//   const allNetworksData = await fetchAllNetworksData();
//   return allNetworksData;
// }

// export default getCoinInfo;

// import axios from "axios";

// // Function to fetch data from the given API endpoint with retry logic
// async function fetchData(url, maxRetries = 5, retryDelay = 2000) {
//   let retries = 0;
//   while (retries < maxRetries) {
//     try {
//       const response = await axios.get(url);
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         // If status is 429 Too Many Requests, wait and retry
//         await new Promise((resolve) => setTimeout(resolve, retryDelay));
//         retryDelay *= 2; // Exponential backoff
//         retries++;
//       } else {
//         console.error(`Error fetching data from ${url}:`, error.message);
//         return null;
//       }
//     }
//   }
//   console.error(
//     `Exceeded maximum number of retries (${maxRetries}) for ${url}`
//   );
//   return null;
// }

// // Function to fetch data for each network ID with retry logic
// async function fetchNetworkData(networkId) {
//   const trendingPoolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/trending_pools?page=1`;

//   const trendingPoolsData = await fetchData(trendingPoolsUrl);
//   console.log(trendingPoolsData);

//   return {
//     trendingPools: trendingPoolsData,
//   };
// }

// // Function to fetch data for all networks
// async function fetchAllNetworksData() {
//   const networksUrl = "https://api.geckoterminal.com/api/v2/networks";
//   const networksData = await fetchData(networksUrl);

//   if (!networksData || !networksData.data) {
//     console.log("No data available");
//     return null;
//   }

//   const allNetworksData = [];

//   for (const network of networksData.data) {
//     const networkData = await fetchNetworkData(network.id);
//     allNetworksData.push({
//       networkId: network.id,
//       networkName: network.attributes.name,
//       data: networkData,
//     });
//   }

//   return allNetworksData;
// }

// // Sample usage
// async function getCoinInfo() {
//   const allNetworksData = await fetchAllNetworksData();
//   return allNetworksData;
// }

// export default getCoinInfo;

import axios from "axios";

// Function to fetch data from the given API endpoint with retry logic
async function fetchData(url, networkId, maxRetries = 15, retryDelay = 2000) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If status is 429 Too Many Requests, wait and retry
        // console.log("Error: " + networkId + " " + retries);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        // retryDelay *= 2; // Exponential backoff
        retries++;
      } else {
        console.error(`Error fetching data from ${url}:`, error.message);
        return null;
      }
    }
  }
  console.error(
    `Exceeded maximum number of retries (${maxRetries}) for ${url}`
  );
  return null;
}

// Function to fetch data for each network ID with retry logic
async function fetchNetworkData(networkId) {
  const trendingPoolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/pools`;
  // const trendingPoolsUrl = `https://api.geckoterminal.com/api/v2/networks/${networkId}/trending_pools?page=1`;

  const trendingPoolsData = await fetchData(trendingPoolsUrl, networkId);

  if (
    !trendingPoolsData ||
    !trendingPoolsData.data ||
    trendingPoolsData.data.length === 0
  ) {
    // console.log(`No trending pools data found for network ID ${networkId}`);
    return null;
  }

  const totalItems = trendingPoolsData.data.length;
  console.log(
    `Total data items in trending pools for network ID ${networkId}:`,
    totalItems
  );

  // Extracting names from attributes and displaying to console
  const names = trendingPoolsData.data.map(pool => pool.attributes.name);
  console.log(`Names from trending pools for network ID ${networkId}:`, names);

  // console.log("Trending pools data:", trendingPoolsData.data);

  return {
    networkId,
    trendingPools: trendingPoolsData.data,
    totalItems,
  };
}

// Function to fetch data for all networks
async function fetchAllNetworksData() {
  const networksUrl = "https://api.geckoterminal.com/api/v2/networks";
  const networksData = await fetchData(networksUrl);

  if (!networksData || !networksData.data) {
    console.log("No data available");
    return null;
  }

  const allNetworksData = [];

  for (const network of networksData.data) {
    const networkData = await fetchNetworkData(network.id);
    if (networkData) {
      allNetworksData.push({
        networkId: networkData.networkId,
        networkName: network.attributes.name,
        data: networkData.trendingPools,
        totalItems: networkData.totalItems,
      });
    }
  }
  console.log("All networks data shared");

  return allNetworksData;
}

// Sample usage
async function getCoinInfo() {
  const allNetworksData = await fetchAllNetworksData();
  return allNetworksData;
}

export default getCoinInfo;
