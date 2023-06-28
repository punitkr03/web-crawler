function main() {
    if(process.argv.length < 3) {
        console.log("No website provided")
        process.exit(1)
    }
    if(process.argv.length > 3) {
        console.log("Too many arguments provided")
        process.exit(1)
    }
    const website = process.argv[2]
    console.log(`Starting crawl of ${website}`)
}
main()