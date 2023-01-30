import branchesJson from "../../../data/branches.json";

interface Props {
  subProfessionId: string;
}

const TraitInfo: React.FC<Props> = ({ subProfessionId }) => {
  const { trait: traitHtml } =
    branchesJson[subProfessionId as keyof typeof branchesJson];
  return <span dangerouslySetInnerHTML={{ __html: traitHtml }} />;
};
export default TraitInfo;
