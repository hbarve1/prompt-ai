"use client";

import { useState, useEffect, ChangeEvent } from "react";

import PromptCard from "./PromptCard";

type PromptPost = {
  _id: string;
  prompt: string;
  tag: string;
  creator: {
    username: string;
  };
};

const PromptCardList = ({
  data,
  handleTagClick,
}: {
  data: PromptPost[];
  handleTagClick: (tagName: string) => void;
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data?.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState<PromptPost[]>([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<PromptPost[]>([]);

  const fetchPosts = async () => {
    const res = await fetch("/api/prompt");
    const data = await res.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i");

    return allPosts.filter((post) => {
      regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt);
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      }, 500),
    );
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for prompts"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      {searchText === "" && (
        <PromptCardList
          data={searchResults.length > 0 ? searchResults : allPosts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
