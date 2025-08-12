const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

if (require.main === module) {
  sleep(1000).then(() => {
    console.log('Slept for 5 second');
  });
}

export default sleep;
