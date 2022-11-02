// This file is mostly temporary. Most types have been moved to the proper
// typing files, but some remain to be moved as we add components later on.

export interface SearchResult {
  type: string;
  name: string;
  charId?: string;
  class?: string;
  subclass?: string;
  rarity?: string;
  subProfession?: string;
}
