"use server";

import { ai } from "@/ai/gemini";
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

export const askAIAboutNotesAction = async (note: string) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const prompt = `You are an AI assistant. Your task is to summarize the following note into bullet points. Format your response as a clean HTML structure.

Use only the following HTML tags when appropriate: <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br>.

Do NOT wrap the entire response in a single <p> tag unless the summary itself is a single paragraph.

Avoid using inline styles, JavaScript, or any custom attributes in your HTML output. Do not include any markdown formatting.

The final HTML output should be structured so that it can be rendered directly in a JSX component like this: <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />.

Here is the note to summarize:

${note}

Please provide the summarized bullet points in the specified HTML format.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  return response.text;
};
