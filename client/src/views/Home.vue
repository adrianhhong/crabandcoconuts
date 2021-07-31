<template>
  <div>
    <v-container style="max-width: 600px">
      <v-row>
        <v-col>
          <h1 class="text-center">crab & coconuts</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="mb-10" />
        </v-col>
      </v-row>
      <v-form ref="name">
        <v-text-field
          outlined
          rounded
          v-model="username"
          label="Enter your name"
          maxlength="10"
          :rules="[rules.nameRequired, rules.nameMax, rules.nameMin]"
        ></v-text-field>
      </v-form>
      <v-container fluid style="height: 300px">
        <v-row align="center">
          <v-col class="text-center">
            <v-row>
              <v-col>
                <v-btn color="buttons" rounded @click="onCreateGame"
                  >Create</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onCreateDev"
                  class="mt-3"
                  >aaaa</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col class="text-center">or</v-col>
          <v-col class="text-center">
            <v-row>
              <v-col>
                <v-form ref="roomId">
                  <v-text-field
                    outlined
                    rounded
                    v-model="roomId"
                    label="Room ID"
                    maxlength="4"
                    :rules="[
                      rules.roomIdRequired,
                      rules.roomIdLength,
                    ]"
                  ></v-text-field>
                </v-form>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onJoinGame"
                  class="mt-3"
                  >Join</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onJoinDev"
                  class="mt-3"
                  >aaaa</v-btn
                ></v-col
              ></v-row
            ></v-col
          >
        </v-row></v-container
      >
      <v-row>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center" justify="center">
          <v-btn @click.stop="showInstructions = true" icon>
            <v-icon> mdi-book-open-variant </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <small
            >Based on the original
            <a
              href="https://boardgamegeek.com/boardgame/92415/skull"
              target="_blank"
              >Skull & Roses</a
            ></small
          >
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center" cols="12">
          <v-btn
            icon
            href="https://github.com/adrianhhong/skull"
            target="_blank"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <strong
            ><a
              href="https://github.com/adrianhhong/skull"
              target="_blank"
              >Adrian Hong</a
            ></strong
          >
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbarShow">
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="secondary"
          text
          v-bind="attrs"
          @click="snackbarShow = false"
          icon
        >
          <v-icon> mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showInstructions" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          How to Play <v-spacer></v-spacer
          ><v-btn icon @click="showInstructions = false"
            ><v-icon> mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <h2>Object of the game</h2>
          <span
            >Win X number of Pearls by succeeding in X challenges, or
            be the last non-eliminated player.</span
          >
          <br />
          <br />
          <br />
          <h2>Gameplay</h2>
          <h3>Step 1 - Turn preparation</h3>
          <span
            >Each player chooses one of their items (Coconut or Crab)
            to place into their first sand pile. Once each player has
            placed one item, play moves on to <b>step 2.</b></span
          >
          <br />
          <br />
          <h3>Step 2 - Adding or Challenge</h3>
          <h4><u>Adding</u></h4>
          <span>
            If they so want, the first player can add
            <b>an extra item</b>, to the right of their first sand
            pile. The next player can then do the same,
            <b>and so on</b>. This can continue around multiple times.
          </span>
          <h4><u>Challenge</u></h4>
          <span>
            If a player <b>cannot or does not want to</b> play an
            additional item, the player
            <b>issues a challenge.</b> They announce the number of
            Coconuts they think they can reveal from among all those
            played. Then, each subsequent player must:
            <ul>
              <li>
                <b>Increase the bid</b> on the previous challenge by
                announcing a greater number.
              </li>
              <li>
                <b>Or pass</b> if they do not think they can reveal a
                greater amount of Coconuts.
              </li>
            </ul>
            Play proceeds until all players pass, save one:
            <b>the player who bid the highest</b>, called the
            <b>Challenger</b>.
          </span>
          <br />
          <br />
          <h3>Step 3 - The attempt</h3>
          <span
            ><b>The Challenger must flip</b> a number of sand piles
            equal to their challenge while respecting the following
            rules:
            <ul>
              <li>
                The player <b>begins</b> by flipping
                <b>all of THEIR own discs</b>.
              </li>
              <li>
                They <b>continue</b> to flip discs with those of the
                other players, and in the order they choose.
              </li>
            </ul>
          </span>
          <h4><u>Failed attempt</u></h4>
          <span
            ><b>ONE CRAB</b> was flipped: the Challenger has
            <b>FAILED</b>. The challenger loses one item for good. If
            they flipped their own Crab, they choose which item to
            remove. If they flipped someone elses Crab, they lose a
            random item. If the Challenger loses their
            <b>last item</b>, they are <b>eliminated</b>. If all
            players except one have been eliminated, the last
            non-eliminated player wins!</span
          >
          <h4><u>Successful attempt</u></h4>
          <span
            ><b>NO CRAB</b> was flipped: the Challenger has
            <b>SUCCEEDED</b>. The Challenger gains a Pearl. First to X
            number of Pearls wins!
          </span>
          <br />
          <br />
          <h3>Step 4 - New round</h3>
          <span
            >Whether they've succeeded or failed,
            <b>the Challenger is the first player</b> of the following
            round, which resumes on <b>step 1</b>.</span
          >
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => {
    return {
      stopButtonRequests: false,
      username: '',
      roomId: '',
      rules: {
        nameRequired: (v) => !!v || 'Please enter a name',
        nameMax: (v) => v.length <= 10 || 'Max 10 characters',
        nameMin: (v) => v.trim().length > 0 || 'Please enter a name',
        roomIdRequired: (v) => !!v || 'Please enter a room ID',
        roomIdLength: (v) =>
          v.length == 4 || 'Room ID is 4 characters long',
      },
      errorMessage: '',
      snackbarShow: false,
      showInstructions: false,
    };
  },
  created: function () {
    this.stopButtonRequests = false;
  },
  methods: {
    /**
     * Prevents button being clicked multiple times sending multiple requests to the server
     */
    debounceClick: function (callback) {
      if (this.stopButtonRequests) return;
      callback();
      this.stopButtonRequests = true;
      setTimeout(() => {
        this.stopButtonRequests = false;
      }, 10000);
    },
    onCreateGame: function () {
      const isValidated = this.$refs.name.validate();
      if (!isValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'create',
        });
      });
    },
    onJoinGame: function () {
      const nameIsValidated = this.$refs.name.validate();
      const roomIdIsValidated = this.$refs.roomId.validate();
      if (!nameIsValidated || !roomIdIsValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: this.roomId,
          enterRoomAction: 'join',
        });
      });
    },
    // !! Remove for PROD
    onCreateDev: function () {
      const isValidated = this.$refs.name.validate();
      if (!isValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'createDev',
        });
      });
    },
    // !! Remove for PROD
    onJoinDev: function () {
      const nameIsValidated = this.$refs.name.validate();
      if (!nameIsValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: 'aaaa',
          enterRoomAction: 'join',
        });
      });
    },
  },
  sockets: {
    /**
     * On successfully created room, commit username and roomId to store, and route to room
     */
    enterRoomSuccess: function ({ username, roomId, pointsToWin }) {
      this.stopButtonRequests = false;
      this.$store.commit('mutatePlayerDetails', {
        username: username,
        roomId: roomId,
        pointsToWin: pointsToWin,
      });
      this.$router.push(`/${roomId}`);
    },
    /**
     * On a failure to join room, show error message
     */
    joinRoomFail: function ({ message }) {
      this.stopButtonRequests = false;
      this.errorMessage = message;
      this.snackbarShow = true;
    },
  },
};
</script>
