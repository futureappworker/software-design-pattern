import { Big2 } from './domain/Big2/Big2'
import { CompareCardPatternFullHouseHandler } from './domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternFullHouseHandler/CompareCardPatternFullHouseHandler'
import { CompareCardPatternPairHandler } from './domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternPairHandler/CompareCardPatternPairHandler'
import { CompareCardPatternSingleHandler } from './domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternSingleHandler/CompareCardPatternSingleHandler'
import { CompareCardPatternStraightHandler } from './domain/RuleEngine/CompareCardPatternHandler/CompareCardPatternStraightHandler/CompareCardPatternStraightHandler'
import { FindPlayablePatternsFullHouseHandler } from './domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsFullHouseHandler/FindPlayablePatternsFullHouseHandler'
import { FindPlayablePatternsPairHandler } from './domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsPairHandler/FindPlayablePatternsPairHandler'
import { FindPlayablePatternsSingleHandler } from './domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsSingleHandler/FindPlayablePatternsSingleHandler'
import { FindPlayablePatternsStraightHandler } from './domain/RuleEngine/FindPlayablePatternsHandler/FindPlayablePatternsStraightHandler/FindPlayablePatternsStraightHandler'
import { IsPlayableFullHouseHandler } from './domain/RuleEngine/IsPlayableHandler/IsPlayableFullHouseHandler/IsPlayableFullHouseHandler'
import { IsPlayablePairHandler } from './domain/RuleEngine/IsPlayableHandler/IsPlayablePairHandler/IsPlayablePairHandler'
import { IsPlayableSingleHandler } from './domain/RuleEngine/IsPlayableHandler/IsPlayableSingleHandler/IsPlayableSingleHandler'
import { IsPlayableStraightHandler } from './domain/RuleEngine/IsPlayableHandler/IsPlayableStraightHandler/IsPlayableStraightHandler'
import { ParseCardPatternFullHouseHandler } from './domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternFullHouseHandler/ParseCardPatternFullHouseHandler'
import { ParseCardPatternPairHandler } from './domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternPairHandler/ParseCardPatternPairHandler'
import { ParseCardPatternSingleHandler } from './domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternSingleHandler/ParseCardPatternSingleHandler'
import { ParseCardPatternStraightHandler } from './domain/RuleEngine/ParseCardPatternHandler/ParseCardPatternStraightHandler/ParseCardPatternStraightHandler'

const isPlayableHandler = new IsPlayableSingleHandler(
  new IsPlayablePairHandler(
    new IsPlayableStraightHandler(new IsPlayableFullHouseHandler(null)),
  ),
)

const parseCardPatternHandler = new ParseCardPatternSingleHandler(
  new ParseCardPatternPairHandler(
    new ParseCardPatternStraightHandler(
      new ParseCardPatternFullHouseHandler(null),
    ),
  ),
)

const compareCardPatternHandler = new CompareCardPatternSingleHandler(
  new CompareCardPatternPairHandler(
    new CompareCardPatternStraightHandler(
      new CompareCardPatternFullHouseHandler(null),
    ),
  ),
)

const findPlayablePatternsHandler = new FindPlayablePatternsSingleHandler(
  new FindPlayablePatternsPairHandler(
    new FindPlayablePatternsStraightHandler(
      new FindPlayablePatternsFullHouseHandler(null),
    ),
  ),
)

const big2 = new Big2({
  isPlayableHandler,
  parseCardPatternHandler,
  compareCardPatternHandler,
  findPlayablePatternsHandler,
})

await big2.start()
