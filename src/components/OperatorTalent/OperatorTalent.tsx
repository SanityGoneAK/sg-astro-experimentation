import { descriptionToHtml } from "../../description-parser";
import type * as OutputTypes from "../../output-types";
import * as classes from "./styles.css";

interface Props {
  talent: OutputTypes.Talent;
  eliteLevel: number;
  potential: number;
  talentNumber: number;
}
const OperatorTalent: React.FC<Props> = ({
  talent,
  eliteLevel,
  potential,
  talentNumber,
}) => {
  const talentPhase =
    talent.candidates
      .sort((a, b) => b.requiredPotentialRank - a.requiredPotentialRank)
      .find(
        (phase) =>
          phase.requiredPotentialRank <= potential &&
          phase.unlockCondition.phase === eliteLevel
      ) ?? null;

  return (
    talentPhase && (
      <div className={classes.card}>
        <div className={classes.titleSection}>
          <p className={classes.talentNumber}>T{talentNumber}</p>
          <h2 className={classes.title}>{talentPhase.name}</h2>
        </div>
        <p
          className={classes.description}
          dangerouslySetInnerHTML={{
            __html: descriptionToHtml(
              talentPhase.description,
              talentPhase.blackboard
            ),
          }}
        ></p>
      </div>
    )
  );
};

export default OperatorTalent;
