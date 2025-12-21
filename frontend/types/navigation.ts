// types/navigation.ts
type Routine = {
  id: string;  // Remove the ? to make it required
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  CustomCall: undefined;
  Routines: { newRoutine?: Omit<Routine, 'id'> };
  AddEditRoutine: { routineId?: string };
  History: undefined;
  Settings: undefined;
};

export type { Routine };

// This allows us to use the navigation prop with proper type checking
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}