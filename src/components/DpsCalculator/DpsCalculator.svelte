<script lang="ts">
  import { calculateDps } from "../../../viktorlab-fork/resources/attributes.js";
  import dpsOptions from "../../../viktorlab-fork/resources/customdata/dps_options.json";
  import operatorsJson from "../../../data/operators.json";

  import type * as OutputTypes from "../../output-types";

  type OperatorDpsOptionsMap = { [tag: string]: OperatorDpsOption };

  interface OperatorDpsOption {
    text: string;
    tooltip?: string;
    enabled: boolean;
  }

  let operatorId: string | null = null;
  let operator: OutputTypes.Operator | null = null;

  let maxElite = 0;
  let elite: number | null = 0;
  let maxLevel = 30;
  let level: number | null = 30;
  let potential: number | null = 1;
  let trust: number | null = 100;
  let skill: OutputTypes.Skill | null = null;
  let skillLevel: number | null = 7;
  let module: OutputTypes.Module | null = null;
  let moduleLevel: number | null = 1;
  let buffsEnabled = true;
  let operatorDpsOptionsTagList: string[] = [];
  let operatorDpsOptions: OperatorDpsOptionsMap = {};

  $: handleOperatorIdChanged(operatorId);

  function handleOperatorIdChanged(operatorId: string | null) {
    operator = operatorId
      ? (operatorsJson[
          operatorId as keyof typeof operatorsJson
        ] as OutputTypes.Operator)
      : null;
    if (!operator) {
      return;
    }

    skillLevel = operator.rarity >= 4 ? 10 : 7;

    if (operator.rarity >= 4) {
      maxElite = 2;
    } else if (operator.rarity > 2) {
      maxElite = 1;
    } else {
      maxElite = 0;
    }
    elite = maxElite;

    maxLevel = (() => {
      if (elite === 2) {
        switch (operator.rarity) {
          case 6:
            return 90;
          case 5:
            return 80;
          case 4:
            return 70;
        }
      } else if (elite === 1) {
        switch (operator.rarity) {
          case 6:
            return 80;
          case 5:
            return 70;
          case 4:
            return 60;
          case 3:
            return 55;
        }
      }
      // elite 0
      switch (operator.rarity) {
        case 6:
        case 5:
          return 50;
        case 4:
          return 45;
        case 3:
          return 40;
      }
      return 30;
    })();

    level = maxLevel;

    skill = operator.skillData.at(-1) ?? null;

    module = operator.modules.at(-1) ?? null;
    moduleLevel = module?.phases?.length ?? 0;

    operatorDpsOptionsTagList = (dpsOptions.char[
      operatorId as keyof typeof dpsOptions.char
    ] ?? []) as Array<keyof typeof dpsOptions.tags>;

    operatorDpsOptions =
      operatorDpsOptionsTagList.reduce<OperatorDpsOptionsMap>((acc, tag) => {
        const option: OperatorDpsOption = {
          text: "",
          enabled: false,
        };

        if (tag.startsWith("cond")) {
          // these are in dps_options.cond_info but come in two formats:
          // - `cond`: plain condition, located at dps_options.cond_info[operatorId].
          // - `cond_somestring`: complex condition, located at dps_options.cond_info[`${operatorId}_somestring].
          let lookupKey =
            tag === "cond"
              ? operatorId
              : `${operatorId}${tag.replace(/^cond/, "")}`;
          const tagData =
            dpsOptions.cond_info[
              lookupKey as keyof typeof dpsOptions.cond_info
            ];
          if (tagData == null) {
            console.error(`Could not find tagData, lookupKey: ${lookupKey}`);
            return acc;
          }

          if (typeof tagData === "number") {
            // e.g. "char_4045_heidi":  2
            // these are 1-indexed talent numbers (yes that is entirely unintuitive)
            // TODO this should be improved by actually including the talent name
            option.text = `Talent ${tagData} active?`;
          } else if (typeof tagData === "string" && tagData === "trait") {
            // e.g. "char_476_blkngt":  "trait"
            // so far all of the string-type values in dps_options.cond_info are "trait"
            // TODO this should be improved by actually including the trait name
            option.text = "Trait active?";
          } else if (typeof tagData === "object") {
            // e.g. "char_322_lmlee":   { "text": "[t1]单挑", "tooltip": "周围八格内仅存在一个敌人" }
            // here "t1" means talent 1
            option.text = tagData.text;
            option.tooltip = tagData.tooltip;
          } else {
            console.error(
              `Unknown conditional tag data format, tagData: ${tagData}`
            );
            return acc;
          }
        } else {
          // plain old tag: check dps_options.tags
          const tagData = dpsOptions.tags[tag as keyof typeof dpsOptions.tags];
          if (!tagData) {
            console.error(`Could not find tag in dpsOptions.tags, tag: ${tag}`);
            return acc;
          }

          option.text = tagData.displaytext;
          option.tooltip = tagData.explain;
          if ("off" in tagData) {
            option.enabled = !tagData.off;
          } else {
            option.enabled = true;
          }
        }
        acc[tag] = option;
        return acc;
      }, {});
  }

  let enemyConfig: Exclude<Parameters<typeof calculateDps>[1], undefined> = {
    def: 0,
    magicResistance: 0,
    count: 1,
  };

  let raidBuff: Exclude<Parameters<typeof calculateDps>[2], undefined> = {
    atk: 0,
    atkpct: 0,
    ats: 0,
    base_atk: 0,
    cdr: 0,
    damage_scale: 0,
  };

  $: calculateDpsResult = operatorId
    ? calculateDps(
        {
          charId: operatorId,
          phase: elite,
          level: level ?? 1,
          potentialRank: (potential ?? 1) - 1,
          favor: trust ?? 100,
          skillId: skill?.skillId ?? "",
          skillLevel: (skillLevel ?? 1) - 1,
          equipId: module?.moduleId ?? "",
          equipLevel: moduleLevel ?? 1,
          options: {
            ...Object.fromEntries(
              Object.entries(operatorDpsOptions).map(([tag, tagSettings]) => [
                tag,
                tagSettings.enabled,
              ])
            ),
            buff: buffsEnabled,
          },
        },
        enemyConfig,
        raidBuff
      )
    : null;
</script>

<div id="calc">
  <div>
    <section>
      <h2>Operator config</h2>
      <label>
        Operator
        <select bind:value={operatorId}>
          {#each Object.values(operatorsJson) as op (op.charId)}
            <option value={op.charId}>{op.name}</option>
          {/each}
        </select>
      </label>

      {#if operator}
        <label>
          Elite
          <input bind:value={elite} type="number" min="0" max={maxElite} />
        </label>
        <label>
          Level
          <input bind:value={level} type="number" min="1" max={maxLevel} />
        </label>
        <label>
          Potential
          <input bind:value={potential} type="number" min="0" max="6" />
        </label>
        <label>
          Trust
          <input bind:value={trust} type="number" min="0" max="200" />
        </label>

        {#if operator.skillData.length > 0}
          <label>
            Skill
            <select bind:value={skill}>
              {#each operator.skillData as skill (skill.skillId)}
                <option value={skill}>{skill.levels[0].name}</option>
              {/each}
            </select>
          </label>

          <label>
            Skill Level
            <select bind:value={skillLevel}>
              {#each [...Array(operator.rarity === 3 ? 7 : 10).keys()].map((i) => i + 1) as skLevel (skLevel)}
                <option value={skLevel}
                  >{skLevel > 7 ? `M${skLevel - 7}` : skLevel}</option
                >
              {/each}
            </select>
          </label>
        {/if}

        {#if operator.modules.length > 0}
          <label>
            Module
            <select bind:value={module}>
              <option value={null}>No Module</option>
              {#each operator.modules as module (module.moduleId)}
                <option value={module}>{module.moduleName}</option>
              {/each}
            </select>
          </label>

          <label>
            Module Level
            <input
              type="number"
              disabled={module == null}
              bind:value={moduleLevel}
              min="1"
              max={module?.phases?.length ?? 1}
            />
          </label>
        {/if}

        {#if operatorDpsOptionsTagList.length > 0}
          <h3>Other options</h3>
          {#each operatorDpsOptionsTagList as tag (tag)}
            <label class="other-option">
              <input
                type="checkbox"
                bind:checked={operatorDpsOptions[tag].enabled}
              />
              {`${operatorDpsOptions[tag].text}${
                operatorDpsOptions[tag].tooltip
                  ? ` (${operatorDpsOptions[tag].tooltip})`
                  : ""
              }`}
            </label>
          {/each}
        {/if}
      {/if}
    </section>

    <section>
      <h2>Enemy config</h2>
      <label>
        Defense
        <input type="number" bind:value={enemyConfig.def} min="0" />
      </label>

      <label>
        Arts Resistance
        <input
          type="number"
          bind:value={enemyConfig.magicResistance}
          min="0"
          max="100"
        />
      </label>

      <label>
        Enemy count
        <input type="number" bind:value={enemyConfig.count} min="0" max="100" />
      </label>
    </section>

    <section>
      <h2>Buffs</h2>
      <label>
        Buffs enabled?
        <input type="checkbox" bind:checked={buffsEnabled} />
      </label>

      <label>
        &#177;Attack (flat increase/decrease)
        <input type="number" bind:value={raidBuff.atk} />
      </label>

      <label>
        &#177;Attack % (percent increase/decrease)
        <input type="number" bind:value={raidBuff.atkpct} />
      </label>

      <label>
        &#177;ASPD
        <input type="number" bind:value={raidBuff.ats} />
      </label>

      <label>
        Base Attack &#177;% (percentage increase/decrease, e.g. Contingency
        Contract)
        <input type="number" bind:value={raidBuff.base_atk} />
      </label>

      <label>
        Skill Recovery &#177;%
        <input type="number" bind:value={raidBuff.cdr} />
      </label>

      <label>
        Attack scale &#177;%
        <input type="number" bind:value={raidBuff.damage_scale} />
      </label>
    </section>
  </div>

  {#if calculateDpsResult}
    <section>
      <h2>Results</h2>

      <dl>
        <div>
          <dt>Average DPS</dt>
          <dd>{calculateDpsResult.globalDps}</dd>
        </div>

        <div>
          <dt>Skill DPS</dt>
          <dd>{calculateDpsResult.skill.dps}</dd>
        </div>

        <div>
          <dt>Skill Attack Damage</dt>
          <dd>{calculateDpsResult.skill.atk}</dd>
        </div>

        <div>
          <dt>Basic Attack DPS</dt>
          <dd>{calculateDpsResult.normal.dps}</dd>
        </div>

        <div>
          <dt>Basic Attack Damage</dt>
          <dd>{calculateDpsResult.normal.atk}</dd>
        </div>
      </dl>

      <pre>
				{JSON.stringify(calculateDpsResult, null, 2)}
			</pre>
    </section>
  {/if}
</div>

<style>
  #calc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
  }

  #calc section {
    display: flex;
    flex-direction: column;
  }

  #calc label:not(.other-option) {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }

  dl > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
