import * as classes from "./styles.css";

interface Props {
  labels: string[];
  value: string;
  onChange: (newValue: string) => void;
}

const PillButtonGroup: React.FC<Props> = ({ labels, value, onChange }) => {
  return (
    <div className={classes.root}>
      {labels.map((label) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          aria-pressed={value === label}
          className={classes.button}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
export default PillButtonGroup;
