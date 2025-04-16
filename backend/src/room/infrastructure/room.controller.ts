import Elysia, { t } from "elysia";
import {
  searchUseCase,
  SearchRoomRequestSchema,
  SearchRoomResponseSchema,
} from "../application/search.usecase";

export const RoomController = new Elysia().group("/room", (app) =>
  app.post(
    "/search",
    async ({ body, set }) => {
      try {
        const results = await searchUseCase({
          name: body?.name,
          id: body?.id,
        });
        set.status = 200;
        return { status: "success", data: { rooms: results.rooms } };
      } catch (error) {
        set.status = 500;
        return {
          status: "error",
          message: error instanceof Error ? error.message : "Search failed",
        };
      }
    },
    {
      body: SearchRoomRequestSchema,
      response: {
        200: t.Object({
          status: t.Literal("success"),
          data: SearchRoomResponseSchema,
        }),
        400: t.Object({
          status: t.Literal("error"),
          message: t.String(),
        }),
      },
      detail: {
        tags: ["Room"],
        summary: "Search a room",
        description: "Search a room by name or id",
      },
    }
  )
);
