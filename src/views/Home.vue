<template>
  <div>
    <v-container style="max-width: 600px">
      <v-row>
        <v-col>
          <h1 class="text-center">
            cr<v-icon>$crab</v-icon>b &
            coc<v-icon>$coconut</v-icon>nuts
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="mb-2" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center"> 1. Enter your name </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form ref="name">
            <v-text-field
              outlined
              rounded
              v-model="username"
              label="Name"
              maxlength="10"
              :rules="[
                rules.nameRequired,
                rules.nameMax,
                rules.nameMin,
              ]"
              @keydown.enter.prevent="onCreateGame"
            ></v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <v-row class="my-5">
        <v-col class="text-center"> 2. Create or Join a room! </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <v-btn color="buttons" rounded @click="onCreateGame"
            >Create</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center my-1"> or </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-form ref="roomId">
            <v-text-field
              outlined
              rounded
              v-model="roomId"
              label="Room ID"
              maxlength="4"
              :rules="[rules.roomIdRequired, rules.roomIdLength]"
              @keydown.enter.prevent="onJoinGame"
              style="width: 180px"
              class="mx-auto"
            ></v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <v-btn color="buttons" rounded @click="onJoinGame"
            >Join</v-btn
          >
        </v-col>
      </v-row>
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
    <v-dialog v-model="showInstructions" width="600">
      <v-card flat tile>
        <v-window v-model="instructionsWindow">
          <v-window-item>
            <v-card elevation="0" height="500">
              <v-card-title>
                TL;DR <v-spacer></v-spacer
                ><v-btn icon @click="showInstructions = false"
                  ><v-icon> mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text
                style="font-size: 1rem"
                align="center"
                justify="center"
              >
                <br />
                <br />
                <span style="font-size: 2rem">C</span>
                hoose cards to play <br />
                <br />
                <span style="font-size: 2rem">R</span>
                emove opponents cards
                <br />
                <br />
                <span style="font-size: 2rem">A</span>
                ccomplish successful bids <br />
                <br />
                <span style="font-size: 2rem">B</span>
                ag enough pearls to win

                <br />
                <br />
                <br />
                <br /><v-icon size="60">$crab</v-icon>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item>
            <v-card
              elevation="0"
              height="500"
              style="overflow-y: scroll"
            >
              <v-card-title>
                Gameplay<v-spacer></v-spacer
                ><v-btn icon @click="showInstructions = false"
                  ><v-icon> mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text
                style="font-size: 0.85rem"
                justify="center"
              >
                <h3>Step 1 - Adding Cards</h3>
                <span
                  >Each player chooses one of their cards (Coconut or
                  Crab) to place down.</span
                >
                <br />
                <br />
                <h3>Step 2 - Adding More or Challenging</h3>
                <span>
                  The next player can add an extra card or challenge,
                  which continues around. To challenge, the player
                  will announce the number of Coconuts they think they
                  can reveal from among all those played. Then, each
                  subsequent player must:
                  <ul>
                    <li>
                      <b>Increase the bid</b> on the previous
                      challenge.
                    </li>
                    <li>
                      <b>Or pass</b> if they do not think they can
                      reveal a greater amount of Coconuts.
                    </li>
                  </ul>
                  Play proceeds until all players except one pass.
                </span>
                <br />
                <br />
                <h3>Step 3 - The Attempt</h3>
                <span
                  ><b>The Challenger must flip</b> a number of cards
                  equal to their challenge noting they must flip all
                  of their <b>own cards first</b>.
                </span>
                <h4><u>Failed attempt</u></h4>
                <span
                  ><b>ONE CRAB</b> was flipped: the Challenger loses
                  one card for good. If the Challenger loses their
                  <b>last card</b>, they are <b>eliminated</b>.</span
                >
                <h4><u>Successful attempt</u></h4>
                <span
                  ><b>NO CRAB</b> was flipped: the Challenger gains a
                  Pearl. First to X number of Pearls wins!
                </span>
                <br />
                <br />
                <h3>Step 4 - New Round</h3>
                <span
                  >The Challenger is the <b>first player</b> of the
                  following round, which resumes on
                  <b>step 1</b>.</span
                >
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
        <v-card-actions class="justify-center">
          <v-item-group
            v-model="instructionsWindow"
            class="text-center"
            mandatory
          >
            <v-item
              v-for="n in 2"
              :key="`btn-${n}`"
              v-slot="{ active, toggle }"
            >
              <v-btn :input-value="active" icon @click="toggle">
                <v-icon>mdi-record</v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
        </v-card-actions>
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
      instructionsWindow: 0,
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
