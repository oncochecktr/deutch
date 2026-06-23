import a2Raw from "../../../../data/grundlagen/a2-core.json";

export interface A2CoreData {
  level: string;
  grammarPack: {
    title: string;
    sections: Array<{
      id: string;
      title: string;
      summary_tr: string;
      examples: string[];
    }>;
  };
}

export function getA2Core(): A2CoreData {
  return a2Raw as A2CoreData;
}
