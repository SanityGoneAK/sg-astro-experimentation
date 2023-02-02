import type { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

interface Props {
  pictureData: GetPictureResult;
}

const Picture: React.FC<Props & React.HTMLAttributes<HTMLImageElement>> = ({
  pictureData,
  ...rest
}) => {
  return (
    <picture>
      {pictureData.sources.map(({ srcset: srcSet, type }, i) => (
        <source key={i} srcSet={srcSet} type={type} />
      ))}
      {/* @ts-expect-error mismatch between astro-jsx & react-jsx types */}
      <img loading="lazy" {...pictureData.image} {...rest} />
    </picture>
  );
};
export default Picture;
