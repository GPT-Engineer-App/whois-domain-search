const fetchValidTLDs = async () => {
  const response = await fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');
  const text = await response.text();
  const tlds = text.split('\n').filter(tld => tld && !tld.startsWith('#')).map(tld => `.${tld.toLowerCase()}`);
  return tlds;
};

export default fetchValidTLDs;