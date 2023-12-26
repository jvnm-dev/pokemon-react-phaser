import { useUserDataStore } from "../stores/userData";
import { openDialog } from "../utils/ui";

export default () => {
  const { completeScenario } = useUserDataStore.getState();

  openDialog({
    content: `BLUE: Gramps! I'm fed up with waiting!`,
    callback: () => {
      openDialog({
        content: `
          OAK: BLUE? Let me think...;
          Oh, that's right, I told you to come! Just wait!;
          Here, red! There are 3 POKEMON here!;
          Haha! They are inside the POKE BALLS.;
          When I was young I was a serious POKEMON trainer!;
          In my old age, I have only 3 left, but you can have one!;
          Choose!`,
        callback: () => {
          openDialog({
            content: `BLUE: Hey! Gramps! What about me?`,
            callback: () => {
              openDialog({
                content: `OAK: Be patient! BLUE, you can have one too!`,
                callback: () => {
                  completeScenario(1);
                }
              });
            },
         });
        }
      });
    }
  });
};
