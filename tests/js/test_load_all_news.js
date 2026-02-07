
const { DataLoader } = require('../../js/data-loader.js');

// Mock fetch
global.fetch = async (url) => {
    console.log(`Fetching: ${url}`);
    if (url === '/news-data.json') {
        return {
            ok: true,
            json: async () => ({
                items: [
                    {
                        title: "Test Item 1",
                        publish_date: "2026-01-01",
                        platform: "Test",
                        platform_type: "Test",
                        tags: ["test"]
                    }
                ]
            })
        };
    }
    return {
        ok: false,
        status: 404,
        statusText: 'Not Found'
    };
};

async function testDuplication() {
    const loader = new DataLoader();
    console.log("Calling loadAllNews()...");
    const result = await loader.loadAllNews();

    console.log(`Total items loaded: ${result.items.length}`);

    // Check for duplicates
    // We expect 1 item if working correctly (deduplicated or only loaded once),
    // but 3 items if the bug exists (since default checks 3 months).

    if (result.items.length > 1) {
        console.log("FAIL: Duplicates found!");
        console.log("Items:");
        result.items.forEach((item, i) => {
            console.log(`  ${i}: ${item.title}`);
        });
        process.exit(1);
    } else {
        console.log("PASS: No duplicates found.");
        process.exit(0);
    }
}

testDuplication();
