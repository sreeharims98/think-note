"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User must be logged in to create a note");
    }

    await prisma.note.create({
      data: {
        id: noteId,
        text: "",
        authorId: user.id,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User must be logged in to update a note");
    }

    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        text: text,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User must be logged in to update a note");
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const getNote = async (noteId: string, userId: string) => {
  return prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: userId,
    },
  });
};

export const getAllNotes = async (userId: string) => {
  return prisma.note.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const askAIAboutNotesAction = async () => {};
