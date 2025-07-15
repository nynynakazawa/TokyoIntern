declare module 'jp-prefecture' {
  const jp: {
    prefectures: Array<{
      name: string;
      cities: Array<{ name: string }>;
    }>;
  };
  export default jp;
} 