"use client";
import SearchableSelectSingle from "@/components/common/searchable-single-select";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { useSubjects } from "@/react-query-hooks/hooks/use-subjects";
import { useClasses } from "@/react-query-hooks/hooks/use-classes";
import { useDispatch, useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import { ILabelValue, IName } from "question-bank-interface";
import { setClass, setSubject } from "@/rtk/slices/classSubject.slice";


// import { SidebarIcon } from "lucide-react"

// import { SearchForm } from "@/components/search-form"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { className, subject } = useSelector(classSubjectState);
  const dispatch = useDispatch();

  const handleSubjectChange = (selectedSubject: ILabelValue) => {
    console.log("Selected Subject: ", selectedSubject);
    // Dispatch action to update selected subject in Redux store
    const selectedSubjectName: IName = {
      id: selectedSubject.value,
      name: selectedSubject.label,
    };
    dispatch(setSubject(selectedSubjectName));
  };
  const handleClassChange = (selectedClass: ILabelValue) => {
    console.log("Selected Class: ", selectedClass);
    // Dispatch action to update selected class in Redux store
    const selectedClassName: IName = {
      id: selectedClass.value,
      name: selectedClass.label,
    };
    dispatch(setClass(selectedClassName));
  };
  return (
    <header
      className="sticky top-0 z-50 flex w-full items-center border-b flex items-center justify-between h-20 max-w-full px-6 py-4 bg- border-b border-b-surfaceVariant shrink-0 self-stretch"
      style={{ background: "var(--Schemes-Surface, #FBF8FD);" }}
    >
      <div className="flex h-(--header-height) w-full justify-between items-center gap-2 px-4">
        <p style={{ color: "#0055A6", fontSize: 26, fontWeight: "bold" }}>
          Question Bank
        </p>
        <div className="flex items-center gap-2 justify-end">
          <div>
            <SearchableSelectSingle
              options={(classes?.data || []).map((classItem) => ({
                value: classItem.id,
                label: classItem.name,
              }))}
              title="Select class"
              value={className?.id}
              onChange={handleClassChange}
              placeholder={
                isLoadingClasses ? "Loading classes..." : "Select class"
              }
              prefix="Class: "
            />
          </div>
          <div>
            <SearchableSelectSingle
              options={(subjects?.data || []).map((subject) => ({
                value: subject.id,
                label: subject.name,
              }))}
              title="Select subject"
              value={subject?.id}
              onChange={handleSubjectChange}
              isLoading={isLoadingSubjects}
              placeholder={
                isLoadingSubjects ? "Loading subjects..." : "Select subject"
              }
            />
          </div>
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="h-10">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
