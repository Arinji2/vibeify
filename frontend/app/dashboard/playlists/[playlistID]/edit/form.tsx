"use client";
import { EditPlaylistAction } from "@/actions/playlist/edit";
import { useToast } from "@/utils/useToast";
import { PlaylistType, SyncType } from "@/utils/validations/playlists/types";
import { Info, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { useFormState } from "react-dom";
export function Form({
  playlistData,
  syncData,
}: {
  playlistData: PlaylistType;
  syncData: SyncType;
}) {
  const initialState = {
    message: "",
    status: 0,
  };

  const [prevState, action] = useFormState(EditPlaylistAction, initialState);

  useToast({
    message: prevState.message,
    status: prevState.status,
    successMessage: "Playlist Updated",
    successRoute: `/dashboard/playlists/${playlistData.id}`,
  });

  const router = useRouter();
  return (
    <form
      action={action}
      className="relative xl:w-[80%] w-full h-fit p-5 border-[3px] flex flex-col items-start justify-start gap-4 border-black shadow-button bg-palette-background"
    >
      <input type="hidden" name="isEdited" value={1} />
      <input type="hidden" name="playlistID" value={playlistData.id} />
      <div className="w-fit h-fit flex flex-col items-start justify-center gap-[2px]">
        <h1 className="text-[40px] md:text-[50px] font-bold text-palette-text">
          Edit Playlist
        </h1>
        <div className="w-full h-[5px] bg-palette-accent"></div>
      </div>
      <div className="px-2 gap-4 w-full h-fit flex flex-col items-start justify-start">
        <SpotifyLink playlistData={playlistData} />
        <PrivateName playlistData={playlistData} />
        <DisplayName playlistData={playlistData} syncData={syncData} />
        <DisplayLink playlistData={playlistData} syncData={syncData} />
        <DisplayPicture syncData={syncData} />
        <div className="w-full h-fit flex flex-row items-center justify-start mt-3 gap-5">
          <PublicPlaylist playlistData={playlistData} />
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start mt-3 gap-5">
          <SubmitButton />
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="px-4 py-2 shadow-button hover:shadow-buttonHover border-[3px] bg-palette-primary border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-black font-medium">Go Back</p>
          </button>
        </div>
      </div>
    </form>
  );
}

function SpotifyLink({ playlistData }: { playlistData: PlaylistType }) {
  return (
    <div className="w-full h-fit flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
      <div className="w-[150px] h-fit shrink-0 flex flex-col items-start justify-center">
        <label className="text-[20px] font-medium text-palette-text whitespace-nowrap">
          Spotify Link:
        </label>
      </div>
      <div className="w-full h-fit t flex flex-row items-center justify-start gap-4">
        <input
          placeholder="https://open.spotify.com/playlist/..../..../..."
          type="text"
          defaultValue={playlistData.spotify_link}
          name="spotifyLink"
          className="w-full px-2 py-3 text-base h-[40px] max-w-[450px] border-[3px] z-30 focus:outline-none border-black bg-palette-background text-palette-text"
        />
        <div className="w-fit h-fit relative">
          <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
          <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 right-0 xl:left-0 rounded-sm bg-black px-3">
            <p className="whitespace-nowrap text-sm ">
              Spotify Link to Public Playlist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivateName({ playlistData }: { playlistData: PlaylistType }) {
  return (
    <div className="w-full h-fit flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
      <div className="w-[150px] h-fit shrink-0 flex flex-col items-start justify-center">
        <label className="text-[20px] font-medium text-palette-text whitespace-nowrap">
          Private Name:
        </label>
      </div>
      <div className="w-full h-fit t flex flex-row items-center justify-start gap-4">
        <input
          placeholder="My Playlist 1"
          type="text"
          defaultValue={playlistData.name}
          name="privateName"
          className="w-full px-2 py-3 text-base h-[40px] max-w-[450px] border-[3px] z-30 focus:outline-none border-black bg-palette-background text-palette-text"
        />
        <div className="w-fit h-fit relative">
          <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
          <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 right-0 xl:left-0 rounded-sm bg-black px-3">
            <p className="whitespace-nowrap text-sm ">
              Private Name to Identify Playlist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function DisplayName({
  playlistData,
  syncData,
}: {
  playlistData: PlaylistType;
  syncData: SyncType;
}) {
  const [sync, setSync] = useState(syncData.displayNameSync);
  return (
    <div className="w-full h-fit t flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
      <div className="w-[150px] h-fit shrink-0 flex flex-col items-start justify-center">
        <label className="text-[20px] font-medium text-palette-text whitespace-nowrap">
          Display Name:
        </label>
      </div>
      <input
        placeholder="My Public Playlist 1"
        type="text"
        defaultValue={playlistData.display_name}
        name="displayName"
        className="w-full z-30 px-2 py-3 text-base h-[40px] md:max-w-[250px] xl:max-w-[300px] border-[3px] focus:outline-none border-black bg-palette-background text-palette-text"
      />
      <div className="w-fit md:w-[184px] xl:w-[135px] h-[40px] flex flex-row items-center gap-2 justify-start ">
        <p className="text-black text-[10px] font-semibold shrink-0">
          Sync with <br /> Spotify
        </p>
        <input
          type="hidden"
          name="displayNameSync"
          value={sync === true ? 1 : 0}
        />
        <div
          onClick={() => setSync(!sync)}
          className="w-[60px] h-[30px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
        >
          <div
            className={`${
              sync
                ? "bg-palette-success translate-x-[50%] "
                : "bg-palette-error -translate-x-[50%] "
            }bg-palette-error w-[40px] h-[25px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
          ></div>
        </div>
        <div className="w-fit h-fit relative pl-5 md:hidden block">
          <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
          <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 -right-20 xl:left-0 rounded-sm bg-black px-3">
            <p className="whitespace-nowrap text-sm ">
              Public Name for your playlist.
            </p>
          </div>
        </div>
      </div>
      <div className="w-fit h-fit relative md:block hidden">
        <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
        <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 right-0 xl:left-0 rounded-sm bg-black px-3">
          <p className="whitespace-nowrap text-sm ">
            Public Name for your playlist.
          </p>
        </div>
      </div>
    </div>
  );
}

function DisplayLink({
  playlistData,
  syncData,
}: {
  playlistData: PlaylistType;
  syncData: SyncType;
}) {
  const [sync, setSync] = useState(syncData.displayLinkSync);
  return (
    <div className="w-full h-fit flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
      <div className="w-[150px] h-fit shrink-0 flex flex-col items-start justify-center">
        <label className="text-[20px] font-medium text-palette-text whitespace-nowrap">
          Display Link:
        </label>
      </div>
      <div className="w-full h-fit  flex flex-col md:flex-row items-start md:items-center justify-start gap-4 ">
        <div className=" px-2 py-3 text-base h-[40px] md:max-w-[250px] xl:max-w-[300px] flex flex-row items-center justify-start border-[3px] focus:outline-none border-black">
          <p className="shrink-0 text-base text-palette-text">
            vibeify.arinji.com/
          </p>
          <input
            type="text"
            defaultValue={playlistData.link}
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase();
              return true;
            }}
            name="displayLink"
            className="w-full z-30 bg-palette-background text-palette-text focus:outline-none"
          />
        </div>
        <div className="w-fit md:w-[184px] xl:w-[135px] h-[40px] flex flex-row items-center gap-2 justify-start ">
          <p className="text-black text-[10px] font-semibold shrink-0">
            Sync with <br /> Spotify
          </p>
          <input
            type="hidden"
            name="displayLinkSync"
            value={sync === true ? 1 : 0}
          />
          <div
            onClick={() => setSync(!sync)}
            className="w-[60px] h-[30px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
          >
            <div
              className={`${
                sync
                  ? "bg-palette-success translate-x-[50%] "
                  : "bg-palette-error -translate-x-[50%] "
              }bg-palette-error w-[40px] h-[25px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
            ></div>
          </div>
          <div className="w-fit h-fit relative pl-5 md:hidden block">
            <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
            <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 -right-20 xl:left-0 rounded-sm bg-black px-3">
              <p className="whitespace-nowrap text-sm ">
                Public Link for your playlist.
              </p>
            </div>
          </div>
        </div>
        <div className="w-fit h-fit relative md:block hidden">
          <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
          <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 right-0 xl:left-0 rounded-sm bg-black px-3">
            <p className="whitespace-nowrap text-sm ">
              Public Link for your playlist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisplayPicture({ syncData }: { syncData: SyncType }) {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [sync, setSync] = useState(syncData.displayPictureSync);
  const [imageUpdated, setImageUpdated] = useState(0);
  return (
    <div className="w-full h-fit t flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
      <div
        className={`${
          hasImage ? "translate-x-0 " : "translate-x-full "
        }w-full transition-all ease-in-out duration-500 z-[1000] bg-black h-[100svh] bg-opacity-80 backdrop-blur-sm fixed top-0 left-0 flex flex-col items-center justify-center`}
      >
        <XCircle
          tabIndex={0}
          className="h-[50px] hover:cursor-pointer w-[50px] focus:scale-75 transition-all ease-in-out duration-300 text-white absolute md:right-10 top-10"
          onClick={() => setHasImage(false)}
        />
        <Image
          src={""}
          alt="Playlist Image"
          className={` object-cover h-[50%] w-[90%] md:h-[60%] xl:h-auto  xl:w-[70%] aspect-video border-0 outline-0 bg-transparent rounded-md`}
          ref={imageRef}
        />
      </div>
      <div className="w-[150px] h-fit shrink-0 flex flex-col items-start justify-center">
        <label className="text-[20px] font-medium text-palette-text whitespace-nowrap">
          Display Picture:
        </label>
      </div>
      <input type="hidden" name="displayPictureUpdated" value={imageUpdated} />
      <input
        placeholder="Click to Upload"
        type="file"
        onChange={(e) => {
          if (e.target.files === null) return;
          const file = e.target.files[0];
          let url = window.URL.createObjectURL(file);

          if (imageRef.current !== null) {
            setHasImage(true);
            imageRef.current.src = url;
            setImageUpdated(1);
          }
        }}
        name="displayPicture"
        className="w-full z-30 py-2 px-2 flex flex-col items-center justify-center text-base h-[40px] md:max-w-[250px] xl:max-w-[300px] border-[3px] focus:outline-none border-black bg-palette-background text-palette-text"
      />
      <div className="w-fit md:w-[184px] xl:w-[135px] h-[40px] flex flex-row items-center gap-2 justify-start ">
        <p className="text-black text-[10px] font-semibold shrink-0">
          Sync with <br /> Spotify
        </p>
        <input
          type="hidden"
          name="displayPictureSync"
          value={sync === true ? 1 : 0}
        />
        <div
          onClick={() => setSync(!sync)}
          className="w-[60px] h-[30px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
        >
          <div
            className={`${
              sync
                ? "bg-palette-success translate-x-[50%] "
                : "bg-palette-error -translate-x-[50%] "
            }bg-palette-error w-[40px] h-[25px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
          ></div>
        </div>
        <div className="w-fit h-fit relative pl-5 md:hidden block">
          <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
          <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 -right-20 xl:left-0 rounded-sm bg-black px-3">
            <p className="whitespace-nowrap text-sm ">
              Public Picture for your playlist.
            </p>
          </div>
        </div>
      </div>
      <div className="w-fit h-fit relative md:block hidden">
        <Info className="h-[25px] md:w-[35px] peer w-[25px] md:h-[35px] text-palette-text" />
        <div className="w-fit flex flex-col opacity-0 z-0 peer-hover:z-50  peer-hover:opacity-100 transition-opacity ease-in-out duration-500 items-center justify-center h-fit absolute py-2 -top-14 md:-top-10 right-0 xl:left-0 rounded-sm bg-black px-3">
          <p className="whitespace-nowrap text-sm ">
            Public Picture for your playlist.
          </p>
        </div>
      </div>
    </div>
  );
}

function PublicPlaylist({ playlistData }: { playlistData: PlaylistType }) {
  const [sync, setSync] = useState(playlistData.public);
  return (
    <div className="w-fit md:w-[184px] xl:w-[135px] h-[40px] flex flex-row items-center gap-2 justify-start ">
      <p className="text-black text-[15px] font-medium shrink-0">
        Public <br /> Playlist
      </p>
      <input
        type="hidden"
        name="publicPlaylist"
        value={sync === true ? 1 : 0}
      />
      <div
        onClick={() => setSync(!sync)}
        className="w-[60px] h-[30px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
      >
        <div
          className={`${
            sync
              ? "bg-palette-success translate-x-[50%] "
              : "bg-palette-error -translate-x-[50%] "
          }bg-palette-error w-[40px] h-[25px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
        ></div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="px-4 py-2 shadow-button hover:shadow-buttonHover border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
    >
      {pending && (
        <Loader2 className="h-[15px] w-[15px] animate-spin text-black" />
      )}{" "}
      <p className="text-[15px] text-black font-medium">Save</p>
    </button>
  );
}
