export const formatWallet = (address: string | undefined): string => {
    if (!address) {
      return '';
    }
    const first = address.slice(0, 5);
    const last = address.slice(address.length - 3, address.length);
    return `${first}...${last}`;
  };