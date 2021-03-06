import commitExcessActions from './commitExcessActions';

export function recompute(previousLiftedState, storeState, action, nextActionId = 1, isExcess) {
  const actionId = nextActionId - 1;
  const liftedState = { ...previousLiftedState };

  if (liftedState.currentStateIndex === liftedState.stagedActionIds.length - 1) {
    liftedState.currentStateIndex++;
  }
  liftedState.stagedActionIds = [...liftedState.stagedActionIds, actionId];
  liftedState.actionsById = { ...liftedState.actionsById };
  if (action.type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action;
  } else {
    liftedState.actionsById[actionId] = {
      action: action.action || action,
      timestamp: action.timestamp || Date.now(),
      type: 'PERFORM_ACTION'
    };
  }
  liftedState.nextActionId = nextActionId;
  liftedState.computedStates = [...liftedState.computedStates, { state: storeState }];

  if (isExcess) commitExcessActions(liftedState);

  return liftedState;
}
