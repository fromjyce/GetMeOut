export type RootStackParamList = {
  Home: undefined;
  CustomCall: undefined;
  Routines: undefined;
  History: undefined;
  Settings: undefined;
  AddEditRoutine: { routineId?: string };
};

// This allows us to use the navigation prop with proper type checking
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
